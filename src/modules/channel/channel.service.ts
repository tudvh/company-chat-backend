import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { UploadApiOptions } from 'cloudinary'
import { EntityManager, Repository } from 'typeorm'

import {
  FOLDER_PATH,
  GROUP_NAME_DEFAULT,
  IMAGE_FORMAT,
  IMAGE_SIZE,
  ROOM_NAME_DEFAULT,
  URL_EXPIRATION,
} from '@/common/constants'
import { RoomTypeEnum } from '@/common/enums'
import { UploadUtil } from '@/common/utils'
import { Channel, ChannelUser, Group, Room } from '@/database/entities'
import { ChannelInvite } from '@/database/entities/channel-invite.entity'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { CreateChannelRequest, JoinChannelRequest } from './dto/request'
import { ChannelDetailResponse, ChannelInviteResponse, ChannelResponse } from './dto/response'

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private readonly channelRepository: Repository<Channel>,
    @InjectRepository(ChannelInvite)
    private readonly channelInviteRepository: Repository<ChannelInvite>,
    @InjectRepository(ChannelUser) private readonly channelUserRepository: Repository<ChannelUser>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async createChannel(
    createChannelRequest: CreateChannelRequest,
    creatorUserId: string,
    thumbnailFile: Express.Multer.File,
  ): Promise<ChannelResponse> {
    // Start a transaction to create the channel and associated entities
    const createdChannel = await this.channelRepository.manager.transaction(
      async transactionManager => {
        // Create and save the new channel
        const newChannel = transactionManager.create(Channel, createChannelRequest)
        await transactionManager.save(newChannel)

        // If a thumbnail file is provided, process and upload it
        if (thumbnailFile) {
          await this.processAndUploadThumbnail(transactionManager, newChannel, thumbnailFile)
        }

        // Create and save the channel-user association
        const channelUserAssociation = transactionManager.create(ChannelUser, {
          userId: creatorUserId,
          channelId: newChannel.id,
          isCreator: true,
        })
        await transactionManager.save(channelUserAssociation)

        // Create and save default chat and call groups
        const now = new Date()
        const chatGroup = transactionManager.create(Group, {
          name: GROUP_NAME_DEFAULT.CHAT,
          channelId: newChannel.id,
          isPrivate: false,
          createdAt: now.toISOString(),
        })
        const callGroup = transactionManager.create(Group, {
          name: GROUP_NAME_DEFAULT.CALL,
          channelId: newChannel.id,
          isPrivate: false,
          createdAt: new Date(now.getTime() + 1000).toISOString(),
        })
        await transactionManager.save([chatGroup, callGroup])

        // Create and save default chat and call rooms
        const chatRoom = transactionManager.create(Room, {
          name: ROOM_NAME_DEFAULT,
          type: RoomTypeEnum.Chat,
          groupId: chatGroup.id,
          isPrivate: false,
          createdAt: new Date(now.getTime() + 2000).toISOString(),
        })
        const callRoom = transactionManager.create(Room, {
          name: ROOM_NAME_DEFAULT,
          type: RoomTypeEnum.Call,
          groupId: callGroup.id,
          isPrivate: false,
          createdAt: new Date(now.getTime() + 3000).toISOString(),
        })
        await transactionManager.save([chatRoom, callRoom])

        // Associate rooms with their respective groups
        chatGroup.rooms = [chatRoom]
        callGroup.rooms = [callRoom]
        newChannel.groups = [chatGroup, callGroup]
        newChannel.channelUsers = [channelUserAssociation]

        return newChannel
      },
    )

    // Return the created channel response with the thumbnail URL if available
    return this.mapToChannelDetailResponse(creatorUserId, createdChannel)
  }

  public async getChannels(userId: string): Promise<ChannelResponse[]> {
    const channels = await this.channelRepository.find({
      where: {
        channelUsers: {
          userId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['channelUsers'],
    })

    return channels.map(channel => this.mapToChannelResponse(userId, channel))
  }

  public async getChannelDetail(userId: string, channelId: string): Promise<ChannelDetailResponse> {
    const channel = await this.channelRepository.findOneOrFail({
      where: {
        id: channelId,
        channelUsers: {
          userId,
        },
      },
      relations: ['groups.rooms', 'channelUsers'],
      order: {
        groups: {
          createdAt: 'ASC',
          rooms: {
            createdAt: 'ASC',
          },
        },
      },
    })

    return this.mapToChannelDetailResponse(userId, channel)
  }

  public async getInviteCode(channelId: string): Promise<ChannelInviteResponse> {
    const channel = await this.channelRepository.findOneBy({
      id: channelId,
    })
    if (!channel) {
      throw new BadRequestException('Channel not found')
    }

    let channelInvite = await this.channelInviteRepository.findOneBy({
      channelId: channelId,
    })
    if (!channelInvite) {
      channelInvite = this.channelInviteRepository.create({
        channelId: channelId,
        expiresTime: new Date().toISOString(),
      })
      await this.channelInviteRepository.save(channelInvite)
    }

    return plainToInstance(ChannelInviteResponse, channelInvite, {
      excludeExtraneousValues: true,
    })
  }

  public async joinChannel(
    userId: string,
    joinChannelRequest: JoinChannelRequest,
  ): Promise<ChannelResponse> {
    const channelInvite = await this.channelInviteRepository.findOne({
      where: {
        id: joinChannelRequest.code,
      },
      relations: ['channel.channelUsers'],
    })
    if (!channelInvite) {
      throw new BadRequestException('Invalid code')
    }

    const channel = channelInvite.channel
    if (channel.channelUsers.some(user => user.userId === userId)) {
      throw new BadRequestException('User already in channel')
    }

    const channelUser = this.channelUserRepository.create({
      channelId: channelInvite.channelId,
      userId: userId,
      isCreator: false,
    })
    await this.channelUserRepository.save(channelUser)

    channel.channelUsers.push(channelUser)

    return this.mapToChannelResponse(userId, channelInvite.channel)
  }

  public async leaveChannel(userId: string, channelId: string): Promise<void> {
    const channelUser = await this.channelUserRepository.findOneBy({
      userId,
      channelId,
    })
    if (!channelUser) {
      throw new BadRequestException('User not in channel')
    }
    if (channelUser.isCreator) {
      throw new BadRequestException('Creator cannot leave channel')
    }

    await this.channelUserRepository.softDelete(channelUser)
  }

  private async processAndUploadThumbnail(
    transactionManager: EntityManager,
    newChannel: Channel,
    thumbnailFile: Express.Multer.File,
  ): Promise<void> {
    const thumbnailSize = await UploadUtil.calculateSquareImageSize(
      thumbnailFile,
      IMAGE_SIZE.CHANNEL_THUMBNAIL,
    )
    const thumbnailUploadOptions: UploadApiOptions = {
      format: IMAGE_FORMAT.CHANNEL_THUMBNAIL,
      resource_type: 'image',
      type: 'authenticated',
      width: thumbnailSize,
      height: thumbnailSize,
      crop: 'fill',
      public_id: `${FOLDER_PATH.CHANNEL_THUMBNAIL}/${newChannel.id}`,
    }
    const thumbnailUploadResult = await this.cloudinaryService.uploadFile(
      thumbnailFile,
      thumbnailUploadOptions,
    )
    newChannel.thumbnailPublicId = thumbnailUploadResult.public_id
    await transactionManager.save(newChannel)
  }

  private mapToChannelResponse(userId: string, channel: Channel): ChannelResponse {
    return plainToInstance(
      ChannelResponse,
      {
        ...channel,
        thumbnailUrl: this.generateChannelThumbnailUrl(channel.thumbnailPublicId),
        isCreator: this.isUserChannelCreator(userId, channel),
      },
      {
        excludeExtraneousValues: true,
      },
    )
  }

  private mapToChannelDetailResponse(userId: string, channel: Channel): ChannelDetailResponse {
    return plainToInstance(
      ChannelDetailResponse,
      {
        ...channel,
        thumbnailUrl: this.generateChannelThumbnailUrl(channel.thumbnailPublicId),
        isCreator: this.isUserChannelCreator(userId, channel),
      },
      {
        excludeExtraneousValues: true,
      },
    )
  }

  private isUserChannelCreator(userId: string, channel: Channel): boolean {
    return channel.channelUsers.find(user => user.userId === userId)?.isCreator ?? false
  }

  private generateChannelThumbnailUrl(thumbnailPublicId: string): string | null {
    if (!thumbnailPublicId) {
      return null
    }
    return this.cloudinaryService.generateSignedImageUrl(
      thumbnailPublicId,
      URL_EXPIRATION.CHANNEL_THUMBNAIL,
    )
  }
}
