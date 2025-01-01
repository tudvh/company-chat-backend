import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class BotLoginRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  email: string
}
