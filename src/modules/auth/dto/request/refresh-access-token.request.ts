import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshAccessTokenRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  public refreshToken: string
}
