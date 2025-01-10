import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from './base.entity'
import { ChannelRole } from './channel-role.entity'

@Entity({ name: 'channel_permission_role' })
export class ChannelPermissionRole extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'channel_role_id' })
  channelRoleId: string

  @Column({ type: 'uuid', name: 'permission_id' })
  permissionId: string

  @ManyToOne(() => ChannelRole, channelRole => channelRole.permissions)
  @JoinColumn({ name: 'channel_role_id' })
  channelRole: ChannelRole
}
