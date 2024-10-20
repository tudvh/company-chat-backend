import { Auth } from '@/common/decorators'
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { RoomResponse } from './dto/response'
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
}
