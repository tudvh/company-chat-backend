import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

import { RoomTypeEnum } from '@/common/enums'

export class RoomResponse {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  name: string

  @ApiProperty()
  @Expose()
  type: RoomTypeEnum

  @ApiProperty()
  @Expose()
  isPrivate: boolean

  @ApiProperty()
  @Expose()
  createdAt: string
}
