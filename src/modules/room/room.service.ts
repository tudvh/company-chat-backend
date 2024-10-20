import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { Repository } from 'typeorm'

import { Room } from '@/database/entities'
import { RoomResponse } from './dto/response'

@Injectable()
export class RoomService {
  constructor(@InjectRepository(Room) private readonly roomRepository: Repository<Room>) {}

  public async getRoomDetail(roomId: string): Promise<RoomResponse> {
    const room = await this.roomRepository.findOneByOrFail({
      id: roomId,
    })

    return plainToInstance(RoomResponse, room, {
      excludeExtraneousValues: true,
    })
  }
}
