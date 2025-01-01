import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class MessageAttachmentResponse {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  fileName: string

  @ApiProperty()
  @Expose()
  fileType: string

  @ApiProperty()
  @Expose()
  fileUrl: string
}
