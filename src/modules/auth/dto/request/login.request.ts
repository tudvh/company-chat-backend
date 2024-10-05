import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class LoginRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  email: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  password: string
}
