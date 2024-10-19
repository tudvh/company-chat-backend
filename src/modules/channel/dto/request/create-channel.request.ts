import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateChannelRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  name: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  description: string
}
