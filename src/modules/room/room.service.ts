import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { RtcRole, RtcTokenBuilder } from 'agora-access-token'
import { plainToInstance } from 'class-transformer'
import { Repository } from 'typeorm'

import { RoomTypeEnum } from '@/common/enums'
import { Room, User } from '@/database/entities'
import { PusherService } from '../pusher/pusher.service'
import { CallInfoResponse, RoomResponse } from './dto/response'
import { UserService } from '../user/user.service'

@Injectable()
export class RoomService {
  constructor(
    private readonly configService: ConfigService,
    private readonly pusherService: PusherService,
    private readonly userService: UserService,
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}

  public async getRoomDetail(roomId: string): Promise<RoomResponse> {
    const room = await this.roomRepository.findOneByOrFail({
      id: roomId,
    })

    return plainToInstance(RoomResponse, room, {
      excludeExtraneousValues: true,
    })
  }

  public async getCallInfo(user: User, roomId: string): Promise<CallInfoResponse> {
    const room = await this.roomRepository.findOneByOrFail({
      id: roomId,
    })

    if (room.type !== RoomTypeEnum.Call) {
      throw new Error('Room type is not call')
    }

    const appId = this.configService.get('AGORA_APP_ID')
    const appCertificate = this.configService.get('AGORA_APP_CERTIFICATE')
    const channelName = room.id
    const account = user.id
    const role = RtcRole.PUBLISHER
    const expirationTimeInSeconds = parseInt(this.configService.get('AGORA_CALL_TOKEN_EXPIRES_IN'))
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

    // Generate RTC token
    const rtcToken = RtcTokenBuilder.buildTokenWithAccount(
      appId,
      appCertificate,
      channelName,
      account,
      role,
      privilegeExpiredTs,
    )

    await this.pusherService.trigger(channelName, 'joined-channel', {
      id: user.id,
      fullName: user.fullName,
      avatarUrl: this.userService.getAvatarUrl(user),
    })

    return {
      channel: channelName,
      rtcToken,
    }
  }
}
