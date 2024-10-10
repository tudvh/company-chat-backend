import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from './base.entity'
import { ChannelUser } from './channel-user.entity'
import { Channel } from './channel.entity'

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 20, name: 'first_name' })
  firstName: string

  @Column({ type: 'varchar', length: 50, name: 'last_name' })
  lastName: string

  @Column({ type: 'date', name: 'dob', nullable: true })
  dob: string

  @Column({ type: 'tinyint', default: 1, name: 'gender', nullable: true })
  gender: number

  @Column({ type: 'varchar', length: 20, name: 'phone_number', nullable: true })
  phoneNumber: string

  @Column({ type: 'varchar', length: 100, name: 'avatar_public_id', nullable: true })
  avatarPublicId: string

  @Column({ type: 'text', name: 'avatar_url', nullable: true })
  avatarUrl: string

  @Column({ type: 'varchar', unique: true, length: 100, name: 'email' })
  email: string

  @Column({ type: 'varchar', length: 255, name: 'password', nullable: true })
  password: string

  @Column({ type: 'varchar', length: 30, name: 'google_id', nullable: true })
  googleId: string

  @Column({ type: 'smallint', unsigned: true, default: 1, name: 'type' })
  type: string

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean

  @OneToMany(() => Channel, channel => channel.creator)
  myChannels: Channel[]

  @OneToMany(() => ChannelUser, channelUser => channelUser.user)
  channelUsers: ChannelUser[]
}
