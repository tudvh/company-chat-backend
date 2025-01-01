import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Pusher from 'pusher'

import { uuidToInt } from '@/common/helpers'
import { User } from '@/database/entities'
import { UserService } from '../user/user.service'
import { PusherAuthRequest } from './dto/request'

@Injectable()
export class PusherService {
  private pusher: Pusher

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.pusher = new Pusher({
      appId: this.configService.get('PUSHER_APP_ID'),
      key: this.configService.get('PUSHER_KEY'),
      secret: this.configService.get('PUSHER_SECRET'),
      cluster: this.configService.get('PUSHER_CLUSTER'),
      useTLS: this.configService.get('PUSHER_USE_TLS') === 'false',
    })
  }

  public async trigger(channel: string, event: string, data: any = null) {
    await this.pusher.trigger(channel, event, data)
  }

  public authorizeChannel(
    user: User,
    pusherAuthRequest: PusherAuthRequest,
  ): Pusher.ChannelAuthResponse {
    const { socket_id, channel_name } = pusherAuthRequest

    const userData: Pusher.PresenceChannelData = {
      user_id: uuidToInt(user.id).toString(),
      user_info: {
        id: user.id,
        fullName: user.fullName,
        avatarUrl: this.userService.getAvatarUrl(user),
      },
    }

    return this.pusher.authorizeChannel(socket_id, channel_name, userData)
  }
}
