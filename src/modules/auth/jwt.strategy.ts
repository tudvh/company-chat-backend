import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'

import { User } from '@/database/entities'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreElements: false,
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    })
  }

  async validate(payload: { userId: string }): Promise<User> {
    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    })

    if (!user) {
      throw new UnauthorizedException('Unauthorized')
    }

    return user
  }
}
