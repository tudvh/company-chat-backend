import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export class CreateGroupRequest {
  @IsString()
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

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  isPrivate: boolean
}
