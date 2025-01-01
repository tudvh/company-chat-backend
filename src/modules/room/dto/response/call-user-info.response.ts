import { ApiProperty } from '@nestjs/swagger'

export class CallUserInfoResponse {
  @ApiProperty()
  uid: string | number

  @ApiProperty()
  id: string

  @ApiProperty()
  fullName: string

  @ApiProperty()
  avatarUrl: string
}
