import { ApiProperty } from '@nestjs/swagger'

export class CallInfoResponse {
  @ApiProperty()
  channel: string

  @ApiProperty()
  rtcToken: string

  @ApiProperty()
  uid: number
}
