import { Auth } from '@/common/decorators'
import { Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { CallInfoResponse, RoomResponse } from './dto/response'
import { RoomService } from './room.service'

@Controller('rooms')
@ApiTags('Room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get(':roomId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: RoomResponse })
  @Auth()
  public async getRoomDetail(@Param('roomId') roomId: string): Promise<RoomResponse> {
    const result = await this.roomService.getRoomDetail(roomId)
    return result
  }

  @Post(':roomId/call-info')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: CallInfoResponse })
  @Auth()
  public async getCallInfo(
    @Param('roomId') roomId: string,
    @Req() request,
  ): Promise<CallInfoResponse> {
    const result = await this.roomService.getCallInfo(request.user, roomId)
    return result
  }
}
