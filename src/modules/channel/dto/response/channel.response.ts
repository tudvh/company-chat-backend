import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class ChannelResponse {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  name: string

  @ApiProperty()
  @Expose()
  description: string

  @ApiProperty()
  @Expose()
  thumbnailUrl: string

  @ApiProperty()
  @Expose()
  createdAt: string
}
