import { IsNotEmpty, IsUUID } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class GetChannelRolesRequest {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  channelId: string
}
