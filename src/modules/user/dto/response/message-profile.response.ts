import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class MessageProfileResponse {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  fullName: string

  @ApiProperty()
  @Expose()
  avatarUrl: string
}
