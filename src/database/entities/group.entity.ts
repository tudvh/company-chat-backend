import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from './base.entity'
import { Channel } from './channel.entity'
import { Room } from './room.entity'
import { User } from './user.entity'

@Entity({ name: 'groups' })
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'channel_id' })
  channelId: string

  @OneToMany(() => Room, room => room.group)
  rooms: Room

  @ManyToOne(() => Channel, channel => channel.groups)
  @JoinColumn({ name: 'channel_id' })
  channel: User
}
