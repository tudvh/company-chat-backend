import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class SendMessageRequest {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  roomId: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  content: string

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  replyId: string
}
