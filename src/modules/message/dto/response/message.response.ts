import { Expose, plainToInstance, Transform } from 'class-transformer'

import { MessageProfileResponse } from '@/modules/user/dto/response'
import { MessageAttachmentResponse } from './message-attachment.response'

export class MessageResponse {
  @Expose()
  id: string

  @Expose()
  content: string

  @Expose()
  sender: MessageProfileResponse

  @Expose()
  @Transform(({ obj }) => {
    return plainToInstance(MessageAttachmentResponse, obj.attachments, {
      excludeExtraneousValues: true,
    })
  })
  attachments: MessageAttachmentResponse[]

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date
}
