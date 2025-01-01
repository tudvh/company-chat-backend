import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from './base.entity'
import { Message } from './message.entity'

@Entity({ name: 'message_attachments' })
export class MessageAttachment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'message_id' })
  messageId: string

  @Column({ type: 'uuid', name: 'public_id', nullable: true })
  publicId: string

  @Column({ type: 'varchar', name: 'file_name' })
  fileName: string

  @Column({ type: 'varchar', name: 'file_type' })
  fileType: string

  @ManyToOne(() => Message, message => message.attachments)
  @JoinColumn({ name: 'message_id' })
  message: Message
}
