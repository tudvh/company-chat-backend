import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from './base.entity'
import { MessageAttachment } from './message-attachment.entity'
import { Room } from './room.entity'
import { User } from './user.entity'

@Entity({ name: 'messages' })
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'room_id' })
  roomId: string

  @Column({ type: 'uuid', name: 'sender_id' })
  senderId: string

  @Column({ type: 'text', name: 'content' })
  content: string

  @Column({ type: 'uuid', name: 'reply_id', nullable: true })
  replyId: string

  @ManyToOne(() => Room, room => room.messages)
  @JoinColumn({ name: 'room_id' })
  room: Room

  @ManyToOne(() => User, user => user.myMessages)
  @JoinColumn({ name: 'sender_id' })
  sender: User

  @ManyToOne(() => Message, message => message.replies)
  @JoinColumn({ name: 'reply_id' })
  reply: Message

  @OneToMany(() => Message, message => message.reply)
  replies: Message[]

  @OneToMany(() => MessageAttachment, attachment => attachment.message)
  attachments: MessageAttachment[]
}
