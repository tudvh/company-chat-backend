import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Channel, ChannelPermissionRole, ChannelRole, ChannelUser } from '@/database/entities'
import { ChannelRoleController } from './channel-role.controller'
import { ChannelRoleService } from './channel-role.service'

@Module({
  imports: [TypeOrmModule.forFeature([Channel, ChannelRole, ChannelPermissionRole, ChannelUser])],
  controllers: [ChannelRoleController],
  providers: [ChannelRoleService],
})
export class ChannelRoleModule {}
