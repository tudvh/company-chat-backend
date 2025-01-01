import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { Auth } from '@/common/decorators'
import { AuthProfileResponse } from '../user/dto/response'
import { AuthService } from './auth.service'
import {
  AuthWithGoogleRequest,
  BotLoginRequest,
  LoginRequest,
  RefreshAccessTokenRequest,
} from './dto/request'
import { AccessTokenResponse, AuthTokenResponse, LoginResponse } from './dto/response'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResponse })
  public async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    const result = await this.authService.login(loginRequest)
    return result
  }

  @Post('/bot-login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResponse })
  public async loginForBot(@Body() loginRequest: BotLoginRequest): Promise<LoginResponse> {
    const result = await this.authService.loginForBot(loginRequest)
    return result
  }

  @Post('/google')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResponse })
  public async authWithGoogle(
    @Body() authWithGoogleRequest: AuthWithGoogleRequest,
  ): Promise<LoginResponse> {
    const result = await this.authService.authWithGoogle(authWithGoogleRequest)
    return result
  }

  @Post('/profile')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthProfileResponse })
  @Auth()
  public async getProfile(@Req() request): Promise<AuthProfileResponse> {
    const result = await this.authService.getProfile(request.user)
    return result
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessTokenResponse })
  public async refreshAccessToken(
    @Body() refreshAccessTokenRequest: RefreshAccessTokenRequest,
  ): Promise<AuthTokenResponse> {
    const result = await this.authService.refreshAccessToken(refreshAccessTokenRequest)
    return result
  }
}
