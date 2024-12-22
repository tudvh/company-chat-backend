import { Expose } from 'class-transformer'

export class MessageAttachmentResponse {
  @Expose()
  id: string

  @Expose()
  fileName: string

  @Expose()
  fileType: string
}
