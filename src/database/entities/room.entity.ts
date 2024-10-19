import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

import { BaseEntity } from './base.entity'
import { Group } from './group.entity'
import { Message } from './message.entity'
import { User } from './user.entity'

@Entity({ name: 'rooms' })
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', nullable: true, name: 'group_id' })
  groupId: string | null

  @Column({ type: 'varchar', length: 100, name: 'name' })
  name: string

  @Column({ type: 'smallint', unsigned: true, name: 'type' })
  type: number

  @Column({ type: 'boolean', name: 'is_private' })
  isPrivate: boolean

  @ManyToOne(() => Group, group => group.rooms)
  @JoinColumn({ name: 'group_id' })
  group: Group

  @ManyToMany(() => User, user => user.rooms)
  users: User[]

  @OneToMany(() => Message, message => message.room)
  messages: Message[]
}
