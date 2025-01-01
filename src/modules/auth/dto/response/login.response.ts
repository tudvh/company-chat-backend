import { ApiProperty } from '@nestjs/swagger'

import { AuthProfileResponse } from '@/modules/user/dto/response'
import { AuthTokenResponse } from './auth-token.response'

export class LoginResponse extends AuthTokenResponse {
  @ApiProperty()
  userProfile: AuthProfileResponse

  @ApiProperty()
  joinedChannelIds: string[]
}
