import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class RoleUserResponse {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  fullName: string

  @ApiProperty()
  @Expose()
  avatarUrl: string

  @ApiProperty()
  @Expose()
  isCreator: boolean
}
