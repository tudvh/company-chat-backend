import { ApiProperty } from '@nestjs/swagger'

import { AuthTokenResponse } from './auth-token.response'
import { ProfileResponse } from './profile.response'

export class LoginResponse extends AuthTokenResponse {
  @ApiProperty()
  userProfile: ProfileResponse
}
