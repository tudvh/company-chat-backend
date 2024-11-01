import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class JoinChannelRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  code: string
}
