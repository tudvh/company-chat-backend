import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from './base.entity'

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 20, name: 'first_name' })
  firstName: string

  @Column({ type: 'varchar', length: 50, name: 'last_name' })
  lastName: string

  @Column({ type: 'varchar', length: 20, name: 'dob', nullable: true })
  dob: string

  @Column({ type: 'tinyint', default: 1, name: 'gender', nullable: true })
  gender: number

  @Column({ type: 'varchar', length: 20, name: 'phone_number', nullable: true })
  phoneNumber: string

  @Column({ type: 'varchar', length: 100, name: 'avatar_public_id', nullable: true })
  avatarPublicId: string

  @Column({ type: 'text', name: 'avatar_url', nullable: true })
  avatarUrl: string

  @Column({ type: 'varchar', length: 100, name: 'email' })
  email: string

  @Column({ type: 'varchar', length: 255, name: 'password', nullable: true })
  password: string

  @Column({ type: 'varchar', length: 30, name: 'google_id', nullable: true })
  googleId: string

  @Column({ type: 'smallint', default: 1, name: 'type' })
  type: string

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean
}
