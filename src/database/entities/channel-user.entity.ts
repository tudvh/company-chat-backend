import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from './base.entity'
import { ChannelRole } from './channel-role.entity'
import { Channel } from './channel.entity'
import { User } from './user.entity'

@Entity({ name: 'channel_user' })
export class ChannelUser extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'channel_id' })
  channelId: string

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string

  @Column({ type: 'boolean', default: false, name: 'is_creator' })
  isCreator: boolean

  @ManyToOne(() => Channel, channel => channel.channelUsers)
  @JoinColumn({ name: 'channel_id' })
  channel: Channel

  @ManyToOne(() => User, user => user.channelUsers)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToMany(() => ChannelRole, channelRole => channelRole.channelUsers)
  channelRoles: ChannelRole[]
}
