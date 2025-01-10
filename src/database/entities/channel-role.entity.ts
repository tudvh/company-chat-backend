import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseEntity } from './base.entity'
import { ChannelPermissionRole } from './channel-permission-role.entity'
import { ChannelUser } from './channel-user.entity'
import { Channel } from './channel.entity'

@Entity({ name: 'channel_roles' })
export class ChannelRole extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'channel_id' })
  channelId: string

  @Column({ type: 'uuid', name: 'name' })
  name: string

  @ManyToOne(() => Channel, channel => channel.invites)
  @JoinColumn({ name: 'channel_id' })
  channel: Channel

  @OneToMany(
    () => ChannelPermissionRole,
    channelPermissionRole => channelPermissionRole.channelRole,
  )
  permissions: ChannelPermissionRole[]

  @ManyToMany(() => ChannelUser, channelUser => channelUser.channelRoles)
  @JoinTable({
    name: 'channel_role_user',
    joinColumn: { name: 'channel_role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'channel_user_id', referencedColumnName: 'id' },
  })
  channelUsers: ChannelUser[]
}
