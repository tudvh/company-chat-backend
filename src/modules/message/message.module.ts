import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Message, MessageAttachment, Room } from '@/database/entities'
import { CloudinaryService } from '../cloudinary/cloudinary.service'
import { PusherService } from '../pusher/pusher.service'
import { UserService } from '../user/user.service'
import { MessageController } from './message.controller'
import { MessageService } from './message.service'

@Module({
  imports: [TypeOrmModule.forFeature([Message, Room, MessageAttachment])],
  controllers: [MessageController],
  providers: [MessageService, UserService, PusherService, CloudinaryService],
})
export class MessageModule {}
