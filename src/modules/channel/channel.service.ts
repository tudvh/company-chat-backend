import { Injectable } from '@nestjs/common'
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
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { CreateChannelRequest } from './dto/request'
import { ChannelDetailResponse, ChannelResponse } from './dto/response'

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private readonly channelRepository: Repository<Channel>,
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
        const chatGroup = transactionManager.create(Group, {
          name: GROUP_NAME_DEFAULT.CHAT,
          channelId: newChannel.id,
          createdAt: new Date().toISOString(),
        })
        const callGroup = transactionManager.create(Group, {
          name: GROUP_NAME_DEFAULT.CALL,
          channelId: newChannel.id,
          createdAt: new Date(new Date().getTime() + 1000).toISOString(),
        })
        await transactionManager.save([chatGroup, callGroup])

        // Create and save default chat and call rooms
        const chatRoom = transactionManager.create(Room, {
          name: ROOM_NAME_DEFAULT,
          type: RoomTypeEnum.Chat,
          groupId: chatGroup.id,
          isPrivate: false,
          createdAt: new Date().toISOString(),
        })
        const callRoom = transactionManager.create(Room, {
          name: ROOM_NAME_DEFAULT,
          type: RoomTypeEnum.Call,
          groupId: callGroup.id,
          isPrivate: false,
          createdAt: new Date(new Date().getTime() + 1000).toISOString(),
        })
        await transactionManager.save([chatRoom, callRoom])

        // Associate rooms with their respective groups
        chatGroup.rooms = [chatRoom]
        callGroup.rooms = [callRoom]
        newChannel.groups = [chatGroup, callGroup]

        return newChannel
      },
    )

    // Return the created channel response with the thumbnail URL if available
    return this.mapToChannelDetailResponse(createdChannel)
  }

  public async getMyChannels(userId: string): Promise<ChannelResponse[]> {
    const channels = await this.channelRepository.find({
      where: {
        channelUsers: {
          userId,
          isCreator: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['channelUsers'],
    })

    return channels.map(channel => this.mapToChannelResponse(channel))
  }

  public async getMyChannelDetail(
    userId: string,
    channelId: string,
  ): Promise<ChannelDetailResponse> {
    const channel = await this.channelRepository.findOneOrFail({
      where: {
        id: channelId,
        channelUsers: {
          userId,
          isCreator: true,
        },
      },
      relations: ['groups.rooms'],
      order: {
        groups: {
          createdAt: 'ASC',
          rooms: {
            createdAt: 'ASC',
          },
        },
      },
    })

    return this.mapToChannelDetailResponse(channel)
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

  private mapToChannelResponse(channel: Channel): ChannelResponse {
    return plainToInstance(
      ChannelResponse,
      {
        ...channel,
        thumbnailUrl: this.generateChannelThumbnailUrl(channel.thumbnailPublicId),
      },
      {
        excludeExtraneousValues: true,
      },
    )
  }

  private mapToChannelDetailResponse(channel: Channel): ChannelDetailResponse {
    return plainToInstance(
      ChannelDetailResponse,
      {
        ...channel,
        thumbnailUrl: this.generateChannelThumbnailUrl(channel.thumbnailPublicId),
      },
      {
        excludeExtraneousValues: true,
      },
    )
  }

  private generateChannelThumbnailUrl(thumbnailPublicId: string): string {
    if (!thumbnailPublicId) {
      return null
    }
    return this.cloudinaryService.generateSignedImageUrl(
      thumbnailPublicId,
      URL_EXPIRATION.CHANNEL_THUMBNAIL,
    )
  }
}
