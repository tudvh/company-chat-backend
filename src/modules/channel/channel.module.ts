import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Channel } from '@/database/entities'
import { CloudinaryModule } from '../cloudinary/cloudinary.module'
import { ChannelController } from './channel.controller'
import { ChannelService } from './channel.service'

@Module({
  imports: [TypeOrmModule.forFeature([Channel]), CloudinaryModule],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}
