import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'

export class PaginationRequest {
  @IsInt()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 1))
  @ApiProperty({
    required: false,
  })
  page?: number = 1

  @IsInt()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({
    required: false,
  })
  perPage?: number = 10
}
