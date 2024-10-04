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

export class LoginResponse {
  @ApiProperty()
  accessToken: string

  @ApiProperty()
  accessTokenExpiresIn: number

  @ApiProperty()
  refreshToken: string

  @ApiProperty()
  refreshTokenExpiresIn: number
}
