import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { Auth } from '@/common/decorators'
import { TestService } from './test.service'

@Controller('test')
@ApiTags('Test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('/pusher')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  public async pusher() {
    await this.testService.pusher()
  }

  @Post('/call')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Auth()
  public call() {
    const result = this.testService.call()
    return result
  }
}
