import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@Controller('health')
@ApiTags('Health Check')
export class HealthCheckController {
  constructor() {}

  @Get()
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    return 'OK'
  }
}
