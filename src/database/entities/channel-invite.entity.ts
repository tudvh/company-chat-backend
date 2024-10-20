import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from './base.entity'
import { Channel } from './channel.entity'

@Entity({ name: 'channel_invites' })
export class ChannelInvite extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'channel_id' })
  channelId: string

  @Column({ type: 'datetime', name: 'expires_time' })
  expiresTime: string

  @ManyToOne(() => Channel, channel => channel.invites)
  channel: Channel
}
