import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from './base.entity'
import { Group } from './group.entity'
import { User } from './user.entity'

@Entity({ name: 'channels' })
export class Channel extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 100, name: 'name' })
  name: string

  @Column({ type: 'text', name: 'description', nullable: true })
  description: string

  @Column({ type: 'boolean', name: 'is_private' })
  isPrivate: boolean

  @Column({ type: 'uuid', name: 'creator_id' })
  creatorId: string

  @OneToMany(() => Group, group => group.channel)
  groups: Group[]

  @ManyToOne(() => User, user => user.channels)
  @JoinColumn({ name: 'creator_id' })
  creator: User
}
