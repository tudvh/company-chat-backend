import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Pusher from 'pusher'

@Injectable()
export class PusherService {
  private pusher: Pusher

  constructor(private readonly configService: ConfigService) {
    this.pusher = new Pusher({
      appId: this.configService.get('PUSHER_APP_ID'),
      key: this.configService.get('PUSHER_KEY'),
      secret: this.configService.get('PUSHER_SECRET'),
      cluster: this.configService.get('PUSHER_CLUSTER'),
      useTLS: this.configService.get('PUSHER_USE_TLS') === 'false',
    })
  }

  async trigger(channel: string, event: string, data: any) {
    await this.pusher.trigger(channel, event, data)
  }
}
