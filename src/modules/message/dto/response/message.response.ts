import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

import { MessageProfileResponse } from '@/modules/user/dto/response'
import { MessageAttachmentResponse } from './message-attachment.response'

export class MessageResponse {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  content: string

  @ApiProperty()
  @Expose()
  sender: MessageProfileResponse

  @ApiProperty()
  @Expose()
  attachments: MessageAttachmentResponse[]

  @ApiProperty()
  @Expose()
  createdAt: Date

  @ApiProperty()
  @Expose()
  updatedAt: Date
}
