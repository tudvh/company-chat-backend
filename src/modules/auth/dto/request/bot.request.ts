import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class BotRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  email: string
}
