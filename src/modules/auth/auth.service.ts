import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import axios from 'axios'
import { plainToInstance } from 'class-transformer'
import { Repository } from 'typeorm'

import { BcryptUtil } from '@/common/utils'
import { User } from '@/database/entities'
import { AuthProfileResponse } from '../user/dto/response'
import { UserService } from '../user/user.service'
import {
  AuthWithGoogleRequest,
  BotLoginRequest,
  LoginRequest,
  RefreshAccessTokenRequest,
} from './dto/request'
import {
  AccessTokenResponse,
  AuthTokenResponse,
  LoginResponse,
  RefreshTokenResponse,
} from './dto/response'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const { email, password } = loginRequest

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['channelUsers.channel'],
    })
    if (!user) {
      throw new BadRequestException('Email hoặc mật khẩu không đúng. Vui lòng thử lại.')
    }

    const isPasswordValid = await BcryptUtil.validatePassword(password, user.password)
    if (!isPasswordValid) {
      throw new BadRequestException('Email hoặc mật khẩu không đúng. Vui lòng thử lại.')
    }

    return this.buildLoginResponse(user)
  }

  public async loginForBot(loginRequest: BotLoginRequest): Promise<LoginResponse> {
    const { email } = loginRequest

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['channelUsers.channel'],
    })
    if (!user) {
      throw new BadRequestException('Email hoặc mật khẩu không đúng. Vui lòng thử lại.')
    }

    return this.buildLoginResponse(user)
  }

  public async authWithGoogle(
    authWithGoogleRequest: AuthWithGoogleRequest,
  ): Promise<LoginResponse> {
    const googleUserResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${authWithGoogleRequest.accessToken}`,
      },
    })
    const { sub: googleId, name: fullName, picture: avatarUrl, email } = googleUserResponse.data

    let user = await this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['channelUsers.channel'],
    })

    if (!user) {
      user = this.userRepository.create({
        fullName,
        email,
        avatarUrl,
        googleId,
        password: await BcryptUtil.hashPassword('123456'),
      })
      await this.userRepository.save(user)
    }

    return this.buildLoginResponse(user)
  }

  public async getProfile(user: User): Promise<AuthProfileResponse> {
    return this.transformToProfileResponse(user)
  }

  public async refreshAccessToken(
    refreshAccessTokenRequest: RefreshAccessTokenRequest,
  ): Promise<AuthTokenResponse> {
    const { userId } = this.jwtService.verify(refreshAccessTokenRequest.refreshToken, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
    })

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['channelUsers.channel'],
    })
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại.')
    }

    return this.buildAuthTokenResponse(user)
  }

  private buildLoginResponse(user: User): LoginResponse {
    return {
      ...this.buildAuthTokenResponse(user),
      userProfile: this.transformToProfileResponse(user),
      joinedChannelIds: user.joinedChannels.map(channel => channel.id),
    }
  }

  private buildAuthTokenResponse(user: User): AuthTokenResponse {
    return {
      ...this.generateAccessToken(user),
      ...this.generateRefreshToken(user),
    }
  }

  private generateAccessToken(user: User): AccessTokenResponse {
    const payload = { userId: user.id }
    const accessToken = this.jwtService.sign(payload)
    return {
      accessToken,
      accessTokenExpiresIn: parseInt(this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN')),
    }
  }

  private generateRefreshToken(user: User): RefreshTokenResponse {
    const payload = { userId: user.id }
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN')}s`,
    })
    return {
      refreshToken,
      refreshTokenExpiresIn: parseInt(this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN')),
    }
  }

  private transformToProfileResponse(user: User): AuthProfileResponse {
    return plainToInstance(
      AuthProfileResponse,
      {
        ...user,
        avatarUrl: this.userService.getAvatarUrl(user),
      },
      {
        excludeExtraneousValues: true,
      },
    )
  }
}
