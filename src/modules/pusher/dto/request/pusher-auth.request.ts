import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class PusherAuthRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  socket_id: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  channel_name: string
}
