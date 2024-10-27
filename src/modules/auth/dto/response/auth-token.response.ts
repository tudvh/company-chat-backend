import { ApiProperty } from '@nestjs/swagger'

export class AccessTokenResponse {
  @ApiProperty()
  accessToken: string

  @ApiProperty()
  accessTokenExpiresIn: number
}

export class RefreshTokenResponse {
  @ApiProperty()
  refreshToken: string

  @ApiProperty()
  refreshTokenExpiresIn: number
}

export class AuthTokenResponse extends (AccessTokenResponse && RefreshTokenResponse) {}
