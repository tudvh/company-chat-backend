import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { AuthWithGoogleRequest, RefreshAccessTokenRequest } from './dto/request'
import { AccessTokenResponse, LoginResponse } from './dto/response'

@Controller('/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/google')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResponse })
  public async authWithGoogle(
    @Body() authWithGoogleRequest: AuthWithGoogleRequest,
  ): Promise<LoginResponse> {
    const result = await this.authService.authWithGoogle(authWithGoogleRequest)
    return result
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessTokenResponse })
  public async refreshAccessToken(
    @Body() refreshAccessTokenRequest: RefreshAccessTokenRequest,
  ): Promise<AccessTokenResponse> {
    const result = await this.authService.refreshAccessToken(refreshAccessTokenRequest)
    return result
  }
}
