import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import * as Pusher from 'pusher'

import { Auth } from '@/common/decorators'
import { PusherAuthRequest } from './dto/request'
import { PusherService } from './pusher.service'

@Controller('pusher')
@ApiTags('Pusher')
export class PusherController {
  constructor(private readonly pusherService: PusherService) {}

  @Post('auth')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Auth()
  getAllMessagesByRoom(
    @Req() request,
    @Body() pusherAuthRequest: PusherAuthRequest,
  ): Pusher.ChannelAuthResponse {
    const result = this.pusherService.authorizeChannel(request.user, pusherAuthRequest)
    return result
  }
}
