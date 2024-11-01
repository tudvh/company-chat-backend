import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateRoomRequest {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  groupId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  name: string

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  type: number

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  isPrivate: boolean
}
