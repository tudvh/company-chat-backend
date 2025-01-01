import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { UserModule } from '../user/user.module'
import { PusherController } from './pusher.controller'
import { PusherService } from './pusher.service'

@Module({
  imports: [ConfigModule.forRoot(), UserModule],
  controllers: [PusherController],
  providers: [PusherService],
  exports: [PusherService],
})
export class PusherModule {}
