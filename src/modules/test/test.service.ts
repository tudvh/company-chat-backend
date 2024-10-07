import { Injectable } from '@nestjs/common'

import { PusherService } from '../pusher/pusher.service'

@Injectable()
export class TestService {
  constructor(private readonly pusherService: PusherService) {}

  public async pusher() {
    this.pusherService.trigger('toanf', 'toanf', { name: 'toanf' })
  }
}
