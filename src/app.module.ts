import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

import { DatabaseModule } from './database/database.module'
import { AuthModule } from './modules/auth/auth.module'
import { PusherModule } from './modules/pusher/pusher.module'

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
    AuthModule,
    PusherModule,
  ],
})
export class AppModule {}
