import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Channel, ChannelUser } from '@/database/entities'
import { ChannelInvite } from '@/database/entities/channel-invite.entity'
import { CloudinaryModule } from '../cloudinary/cloudinary.module'
import { PusherModule } from '../pusher/pusher.module'
import { UserService } from '../user/user.service'
import { ChannelController } from './channel.controller'
import { ChannelService } from './channel.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, ChannelInvite, ChannelUser]),
    CloudinaryModule,
    PusherModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService, UserService],
})
export class ChannelModule {}
