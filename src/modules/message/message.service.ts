import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { UploadApiOptions } from 'cloudinary'
import { Repository } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'

import { FOLDER_PATH, URL_EXPIRATION } from '@/common/constants'
import { Message, MessageAttachment, Room, User } from '@/database/entities'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { PusherService } from '../pusher/pusher.service'
import { UserService } from '../user/user.service'
import { SendMessageRequest } from './dto/request'
import { MessageResponse } from './dto/response'

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    private readonly userService: UserService,
    private readonly pusherService: PusherService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async getAllMessagesByRoom(roomId: string): Promise<MessageResponse[]> {
    const messages = await this.messageRepository.find({
      where: {
        roomId,
      },
      relations: ['sender', 'reply', 'attachments'],
      order: {
        createdAt: 'ASC',
      },
    })

    return this.mapMultipleMessagesToResponse(messages)
  }

  public async sendMessage(
    sender: User,
    sendMessageRequest: SendMessageRequest,
    attachmentFiles?: Express.Multer.File[],
  ): Promise<MessageResponse> {
    if (!sendMessageRequest.content && (!attachmentFiles || attachmentFiles.length <= 0)) {
      throw new BadRequestException('Content or attachment is required')
    }

    const room = await this.roomRepository.findOne({
      where: {
        id: sendMessageRequest.roomId,
      },
      relations: ['group'],
    })

    if (!room) {
      throw new BadRequestException('Room not found')
    }

    return await this.messageRepository.manager.transaction(async transactionalEntityManager => {
      const message = transactionalEntityManager.create(Message, {
        ...sendMessageRequest,
        senderId: sender.id,
      })
      await transactionalEntityManager.save(message)

      if (attachmentFiles) {
        const attachmentEntities = attachmentFiles.map(file => {
          const id = uuidV4()
          const attachmentEntity = transactionalEntityManager.create(MessageAttachment, {
            id,
            publicId: `${FOLDER_PATH.MESSAGE_ATTACHMENT}/${id}`,
            messageId: message.id,
            fileName: file.originalname,
            fileType: file.mimetype,
          })
          return attachmentEntity
        })
        await transactionalEntityManager.save(attachmentEntities)

        await Promise.all(
          attachmentFiles.map(async (file, index) => {
            const attachmentOptions: UploadApiOptions = {
              resource_type: 'auto',
              type: 'authenticated',
              public_id: attachmentEntities[index].publicId,
            }
            await this.cloudinaryService.uploadFile(file, attachmentOptions)
          }),
        )

        message.attachments = attachmentEntities
      }
      message.sender = sender

      const messageResponse = this.mapSingleMessageToResponse(message, room.group.channelId)

      await this.pusherService.trigger(sendMessageRequest.roomId, 'new-message', {
        ...messageResponse,
        room_id: room.id,
        channel_id: room.group.channelId,
      })

      return messageResponse
    })
  }

  private mapSingleMessageToResponse(message: Message, channelId?: string): MessageResponse {
    return plainToInstance(
      MessageResponse,
      {
        ...message,
        channelId,
        sender: {
          id: message.sender.id,
          fullName: message.sender.fullName,
          avatarUrl: this.userService.getAvatarUrl(message.sender),
        },
        attachments: message.attachments?.map(attachment => {
          const resourceType = attachment.fileType.includes('word') ? 'raw' : 'image'
          return {
            id: attachment.id,
            fileName: attachment.fileName,
            fileType: attachment.fileType,
            fileUrl: this.cloudinaryService.generateSignedUrl(
              attachment.publicId,
              URL_EXPIRATION.MESSAGE_ATTACHMENT,
              resourceType,
            ),
          }
        }),
      },
      {
        excludeExtraneousValues: true,
      },
    )
  }

  private mapMultipleMessagesToResponse(messages: Message[]): MessageResponse[] {
    return messages.map(this.mapSingleMessageToResponse.bind(this))
  }
}
