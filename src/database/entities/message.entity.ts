import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from './base.entity'
import { Room } from './room.entity'

@Entity({ name: 'messages' })
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'room_id' })
  roomId: string

  @Column({ type: 'text', name: 'content' })
  content: string

  @Column({ type: 'uuid', name: 'reply_id' })
  replyId: string

  @ManyToOne(() => Room, room => room.messages)
  @JoinColumn({ name: 'room_id' })
  room: Room

  @ManyToOne(() => Message, message => message.replies)
  @JoinColumn({ name: 'reply_id' })
  reply: Message

  @OneToMany(() => Message, message => message.reply)
  replies: Message[]
}
