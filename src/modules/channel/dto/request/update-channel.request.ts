import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateChannelRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  name: string
}
