import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'

export class ChannelInviteResponse {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.id)
  code: string
}
