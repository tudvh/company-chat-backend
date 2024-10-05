import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AuthWithGoogleRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  public accessToken: string
}
