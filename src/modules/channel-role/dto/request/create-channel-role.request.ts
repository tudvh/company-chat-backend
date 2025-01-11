import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class CreateChannelRoleRequest {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  channelId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  name: string
}
