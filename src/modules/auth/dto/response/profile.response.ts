import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class ProfileResponse {
  @ApiProperty()
  @Expose()
  id: string

  @ApiProperty()
  @Expose()
  firstName: string

  @ApiProperty()
  @Expose()
  lastName: string

  @ApiProperty()
  @Expose()
  dob: string

  @ApiProperty()
  @Expose()
  gender: number

  @ApiProperty()
  @Expose()
  phoneNumber: string

  @ApiProperty()
  @Expose()
  avatarPublicId: string

  @ApiProperty()
  @Expose()
  avatarUrl: string

  @ApiProperty()
  @Expose()
  email: string

  @ApiProperty()
  @Expose()
  googleId: string

  @ApiProperty()
  @Expose()
  type: number
}
