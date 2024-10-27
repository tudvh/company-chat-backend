import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Room } from '@/database/entities'
import { PusherModule } from '../pusher/pusher.module'
import { UserModule } from '../user/user.module'
import { RoomController } from './room.controller'
import { RoomService } from './room.service'

@Module({
  imports: [TypeOrmModule.forFeature([Room]), PusherModule, UserModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
