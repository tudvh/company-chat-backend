import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Channel, ChannelUser } from '@/database/entities'
import { CloudinaryModule } from '../cloudinary/cloudinary.module'
import { ChannelController } from './channel.controller'
import { ChannelService } from './channel.service'
import { ChannelInvite } from '@/database/entities/channel-invite.entity'
import { UserService } from '../user/user.service'

@Module({
  imports: [TypeOrmModule.forFeature([Channel, ChannelInvite, ChannelUser]), CloudinaryModule],
  controllers: [ChannelController],
  providers: [ChannelService, UserService],
})
export class ChannelModule {}
