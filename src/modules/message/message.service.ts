import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { UploadApiOptions } from 'cloudinary'
import { Repository } from 'typeorm'
import { v4 as uuidV4 } from 'uuid'

import { FOLDER_PATH } from '@/common/constants'
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
  ): Promise<void> {
    if (!sendMessageRequest.content && (!attachmentFiles || attachmentFiles.length <= 0)) {
      throw new BadRequestException('Content or attachment is required')
    }

    const room = this.roomRepository.findOneBy({
      id: sendMessageRequest.roomId,
    })

    if (!room) {
      throw new BadRequestException('Room not found')
    }

    await this.messageRepository.manager.transaction(async transactionalEntityManager => {
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
          attachmentFiles.map(async (attachmentFiles, index) => {
            const attachmentOptions: UploadApiOptions = {
              resource_type: 'auto',
              type: 'authenticated',
              public_id: attachmentEntities[index].publicId,
            }
            await this.cloudinaryService.uploadFile(attachmentFiles, attachmentOptions)
          }),
        )

        message.attachments = attachmentEntities
      }
      message.sender = sender

      const messageResponse = this.mapSingleMessageToResponse(message)

      await this.pusherService.trigger(sendMessageRequest.roomId, 'new-message', messageResponse)

      return messageResponse
    })
  }

  private mapSingleMessageToResponse(message: Message): MessageResponse {
    return plainToInstance(
      MessageResponse,
      {
        ...message,
        sender: {
          id: message.sender.id,
          fullName: message.sender.fullName,
          avatarUrl: this.userService.getAvatarUrl(message.sender),
        },
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
