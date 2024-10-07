import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from './base.entity'
import { Group } from './group.entity'

@Entity({ name: 'rooms' })
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'group_id' })
  groupId: string

  @Column({ type: 'smallint', unsigned: true, name: 'type' })
  type: number

  @ManyToOne(() => Group, group => group.rooms)
  @JoinColumn({ name: 'group_id' })
  group: Group
}
