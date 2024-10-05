import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import axios from 'axios'
import { plainToInstance } from 'class-transformer'
import { Repository } from 'typeorm'

import { User } from '@/database/entities'
import { AuthWithGoogleRequest, LoginRequest, RefreshAccessTokenRequest } from './dto/request'
import {
  AccessTokenResponse,
  LoginResponse,
  ProfileResponse,
  RefreshTokenResponse,
} from './dto/response'
import { BcryptUtil } from '@/common/utils'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const { email, password } = loginRequest

    const user = await this.userRepository.findOneBy({
      email,
    })
    if (!user) {
      throw new BadRequestException('Email or password is incorrect')
    }

    // compare password
    const isPasswordValid = await BcryptUtil.validatePassword(password, user.password)
    if (!isPasswordValid) {
      throw new BadRequestException('Email or password is incorrect')
    }

    const accessToken = await this.createAccessToken(user)
    const refreshToken = await this.createRefreshToken(user)
    return {
      ...accessToken,
      ...refreshToken,
      userProfile: plainToInstance(ProfileResponse, user, {
        excludeExtraneousValues: true,
      }),
    }
  }

  public async authWithGoogle(
    authWithGoogleRequest: AuthWithGoogleRequest,
  ): Promise<LoginResponse> {
    const googleUserResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${authWithGoogleRequest.accessToken}`,
      },
    })

    const {
      sub: googleId,
      given_name: firstName,
      family_name: lastName,
      picture: avatarUrl,
      email,
    } = googleUserResponse.data

    let user = await this.userRepository.findOneBy({
      email,
    })

    if (!user) {
      user = this.userRepository.create({
        firstName,
        lastName,
        email,
        avatarUrl,
        googleId,
      })
      await this.userRepository.save(user)
    }

    const accessToken = await this.createAccessToken(user)
    const refreshToken = await this.createRefreshToken(user)
    return {
      ...accessToken,
      ...refreshToken,
      userProfile: plainToInstance(ProfileResponse, user, {
        excludeExtraneousValues: true,
      }),
    }
  }

  public async getProfile(userId: string): Promise<ProfileResponse> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    })
    if (!user) {
      throw new BadRequestException('User not found')
    }

    return plainToInstance(ProfileResponse, user, {
      excludeExtraneousValues: true,
    })
  }

  public async refreshAccessToken(
    refreshAccessTokenRequest: RefreshAccessTokenRequest,
  ): Promise<AccessTokenResponse> {
    const { userId } = this.jwtService.verify(refreshAccessTokenRequest.refreshToken, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
    })

    const user = await this.userRepository.findOneBy({
      id: userId,
    })
    if (!user) {
      throw new InternalServerErrorException('User not found')
    }

    const accessToken = await this.createAccessToken(user)
    return accessToken
  }

  private async createAccessToken(user: User): Promise<AccessTokenResponse> {
    const payload = { userId: user.id }
    const accessToken = this.jwtService.sign(payload)
    return {
      accessToken,
      accessTokenExpiresIn: parseInt(this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN')),
    }
  }

  private async createRefreshToken(user: User): Promise<RefreshTokenResponse> {
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
}
