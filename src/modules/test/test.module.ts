import { Module } from '@nestjs/common'

import { TestController } from './test.controller'
import { TestService } from './test.service'
import { PusherService } from '../pusher/pusher.service'

@Module({
  imports: [],
  controllers: [TestController],
  providers: [TestService, PusherService],
})
export class TestModule {}
