import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class GetCallInfoRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  roomId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  socketId: string
}
