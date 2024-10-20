import { ApiProperty } from '@nestjs/swagger'
import { Expose, plainToInstance, Transform } from 'class-transformer'

import { RoomResponse } from '@/modules/room/dto/response'
import { GroupResponse } from './group.response'
import { Room } from '@/database/entities'

export class GroupDetailResponse extends GroupResponse {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) =>
    obj.rooms.map((room: Room) =>
      plainToInstance(RoomResponse, room, {
        excludeExtraneousValues: true,
      }),
    ),
  )
  rooms: RoomResponse[]
}
