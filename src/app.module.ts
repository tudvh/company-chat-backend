import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

import { DatabaseModule } from './database/database.module'
import { AuthModule } from './modules/auth/auth.module'
import { ChannelModule } from './modules/channel/channel.module'
import { HealthCheckModule } from './modules/health-check/health-check.module'
import { PusherModule } from './modules/pusher/pusher.module'
import { RoomModule } from './modules/room/room.module'
import { TestModule } from './modules/test/test.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join('public'),
      serveRoot: '/',
    }),
    DatabaseModule,
    PusherModule,
    HealthCheckModule,
    TestModule,
    AuthModule,
    ChannelModule,
    RoomModule,
  ],
})
export class AppModule {}
