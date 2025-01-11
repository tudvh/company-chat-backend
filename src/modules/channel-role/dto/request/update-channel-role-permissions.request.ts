import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class UpdateChannelRolePermissionsRequest {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    required: true,
  })
  permissions: string[]
}
