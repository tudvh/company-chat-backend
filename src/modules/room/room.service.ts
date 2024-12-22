import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { RtcRole, RtcTokenBuilder } from 'agora-access-token'
import { plainToInstance } from 'class-transformer'
import { Repository } from 'typeorm'

import { RoomTypeEnum } from '@/common/enums'
import { Room, User } from '@/database/entities'
import { PusherService } from '../pusher/pusher.service'
import { UserService } from '../user/user.service'
import { CreateRoomRequest } from './dto/request'
import { CallInfoResponse, RoomResponse } from './dto/response'

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

    const appId = this.configService.get<string>('AGORA_APP_ID')
    const appCertificate = this.configService.get<string>('AGORA_APP_CERTIFICATE')
    const channelName = room.id
    const uid = Math.floor(Math.random() * 21)
    const role = RtcRole.PUBLISHER
    const expirationTimeInSeconds = parseInt(this.configService.get('AGORA_CALL_TOKEN_EXPIRES_IN'))
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

    // Generate RTC token
    const rtcToken = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
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
      uid,
    }
  }

  public async createRoom(createRoomRequest: CreateRoomRequest): Promise<RoomResponse> {
    const room = this.roomRepository.create(createRoomRequest)
    await this.roomRepository.save(room)

    return plainToInstance(RoomResponse, room, {
      excludeExtraneousValues: true,
    })
  }
}
