import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class SendMessageRequest {
  @IsUUID()
  @IsNotEmpty()
  roomId: string

  @IsString()
  @IsOptional()
  content: string

  @IsUUID()
  @IsOptional()
  replyId: string
}
