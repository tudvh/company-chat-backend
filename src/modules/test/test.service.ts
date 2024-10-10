import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RtcRole, RtcTokenBuilder } from 'agora-access-token'

import { PusherService } from '../pusher/pusher.service'

@Injectable()
export class TestService {
  constructor(
    private readonly pusherService: PusherService,
    private readonly configService: ConfigService,
  ) {}

  public async pusher(): Promise<void> {
    this.pusherService.trigger('toanf', 'toanf', { name: 'toanf' })
  }

  public call(): string {
    const appId = this.configService.get('AGORA_APP_ID')
    const appCertificate = this.configService.get('AGORA_APP_CERTIFICATE')
    const channelName = 'main'
    const account = '0'
    const role = RtcRole.PUBLISHER
    const expirationTimeInSeconds = 3600
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

    const tokenWithUserAccount = RtcTokenBuilder.buildTokenWithAccount(
      appId,
      appCertificate,
      channelName,
      account,
      role,
      privilegeExpiredTs,
    )

    return tokenWithUserAccount
  }
}
