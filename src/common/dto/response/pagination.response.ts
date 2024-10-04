import { ApiProperty } from '@nestjs/swagger'

export class PaginationMetadata {
  @ApiProperty()
  currentPage: number

  @ApiProperty()
  from: number

  @ApiProperty()
  lastPage: number

  @ApiProperty()
  perPage: number

  @ApiProperty()
  to: number

  @ApiProperty()
  total: number

  constructor(currentPage: number, itemsPerPage: number, totalItems: number) {
    this.currentPage = currentPage
    this.from = (currentPage - 1) * itemsPerPage + 1
    this.lastPage = Math.ceil(totalItems / itemsPerPage)
    this.perPage = itemsPerPage
    this.to = currentPage * itemsPerPage < totalItems ? currentPage * itemsPerPage : totalItems
    this.total = totalItems
  }
}

export class PaginationResponse<T> {
  @ApiProperty({ type: [Object] })
  items: T[]

  @ApiProperty()
  metadata: PaginationMetadata
}
