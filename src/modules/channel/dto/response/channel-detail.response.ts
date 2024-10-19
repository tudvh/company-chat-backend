import { ApiProperty } from '@nestjs/swagger'
import { Expose, plainToInstance, Transform } from 'class-transformer'

import { Group } from '@/database/entities'
import { GroupDetailResponse } from '@/modules/group/dto/response'
import { ChannelResponse } from './channel.response'

export class ChannelDetailResponse extends ChannelResponse {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) =>
    obj.groups.map((group: Group) =>
      plainToInstance(GroupDetailResponse, group, {
        excludeExtraneousValues: true,
      }),
    ),
  )
  groups: GroupDetailResponse[]
}
