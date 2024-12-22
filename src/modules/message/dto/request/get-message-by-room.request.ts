import { IsNotEmpty, IsUUID } from 'class-validator'

export class GetMessageByRoomRequest {
  @IsUUID()
  @IsNotEmpty()
  roomId: string
}
