import { Auth } from '@/common/decorators'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { CreateRoomRequest } from './dto/request'
import { CallInfoResponse, RoomResponse } from './dto/response'
import { RoomService } from './room.service'
import { Room } from '@/database/entities'

@Controller('rooms')
@ApiTags('Room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('get-all-free-room')
  @HttpCode(HttpStatus.OK)
  @Auth()
  public async getAllFreeRoom(@Query('channelId') channelId: string): Promise<Room[]> {
    const result = await this.roomService.getAllFreeRoom(channelId)
    return result
  }

  @Get('get-all-room-bot')
  @HttpCode(HttpStatus.OK)
  @Auth()
  public async getAllRoomBot(): Promise<string[]> {
    const result = await this.roomService.getAllRoomBot()
    return result
  }

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
    @Req() request,
    @Param('roomId') roomId: string,
  ): Promise<CallInfoResponse> {
    const result = await this.roomService.getCallInfo(request.user, roomId)
    return result
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: RoomResponse })
  @Auth()
  public async createRoom(@Body() createRoomRequest: CreateRoomRequest): Promise<RoomResponse> {
    const result = await this.roomService.createRoom(createRoomRequest)
    return result
  }
}
