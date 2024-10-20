import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from './base.entity'
import { ChannelInvite } from './channel-invite.entity'
import { ChannelUser } from './channel-user.entity'
import { Group } from './group.entity'
import { User } from './user.entity'

@Entity({ name: 'channels' })
export class Channel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 100, name: 'name' })
  name: string

  @Column({ type: 'text', nullable: true, name: 'description' })
  description: string

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'thumbnail_public_id' })
  thumbnailPublicId: string

  @OneToMany(() => Group, group => group.channel)
  groups: Group[]

  @OneToMany(() => ChannelUser, channelUser => channelUser.channel)
  channelUsers: ChannelUser[]

  @OneToMany(() => ChannelInvite, channelInvite => channelInvite.channel)
  invites: ChannelInvite[]

  get creator(): User {
    return this.channelUsers.find(channelUser => channelUser.isCreator).user
  }
}
