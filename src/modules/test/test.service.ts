import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

// import { Role as RtcRole, RtcTokenBuilder } from '@/common/libs/RtcTokenBuilder2'
import { PusherService } from '../pusher/pusher.service'
import { RtcTokenBuilder, RtcRole } from 'agora-access-token'

@Injectable()
export class TestService {
  constructor(
    private readonly pusherService: PusherService,
    private readonly configService: ConfigService,
  ) {}

  public async pusher(): Promise<void> {
    this.pusherService.trigger('toanf', 'toanf', { name: 'toanf' })
  }

  public call(userId: string): string {
    const appId = this.configService.get('AGORA_APP_ID')
    const appCertificate = this.configService.get('AGORA_APP_CERTIFICATE')
    const channelName = 'main'
    const account = 123
    const role = RtcRole.PUBLISHER
    const tokenExpirationInSecond = 3600
    const privilegeExpirationInSecond = 3600

    const currentTimestamp = Math.floor(Date.now() / 1000)
    const privilegeExpiredTs = currentTimestamp + tokenExpirationInSecond

    const tokenWithUserAccount = RtcTokenBuilder.buildTokenWithUid(
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
