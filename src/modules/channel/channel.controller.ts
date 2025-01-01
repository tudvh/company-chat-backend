import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { Auth } from '@/common/decorators'
import { UploadUtil } from '@/common/utils'
import { ChannelService } from './channel.service'
import { CreateChannelRequest, JoinChannelRequest } from './dto/request'
import { ChannelDetailResponse, ChannelInviteResponse, ChannelResponse } from './dto/response'

@Controller('channels')
@ApiTags('Channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: ChannelResponse })
  @UseInterceptors(FileInterceptor('thumbnailFile', { fileFilter: UploadUtil.imageFileFilter() }))
  @Auth()
  async createChannel(
    @Req() request,
    @Body() createChannelRequest: CreateChannelRequest,
    @UploadedFile() thumbnailFile: Express.Multer.File,
  ): Promise<ChannelResponse> {
    const result = await this.channelService.createChannel(
      request.user.id,
      createChannelRequest,
      thumbnailFile,
    )
    return result
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [ChannelResponse] })
  @Auth()
  async getChannels(@Req() request): Promise<ChannelResponse[]> {
    return this.channelService.getChannels(request.user.id)
  }

  @Get(':channelId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChannelDetailResponse })
  @Auth()
  async getChannelDetail(
    @Req() request,
    @Param('channelId') channelId: string,
  ): Promise<ChannelDetailResponse> {
    return this.channelService.getChannelDetail(request.user.id, channelId)
  }

  @Get(':channelId/invite')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChannelInviteResponse })
  @Auth()
  async getInviteCode(@Param('channelId') channelId: string): Promise<ChannelInviteResponse> {
    return this.channelService.getInviteCode(channelId)
  }

  @Post('/join')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: Boolean })
  @Auth()
  async joinChannel(
    @Req() request,
    @Body() joinChannelRequest: JoinChannelRequest,
  ): Promise<ChannelResponse> {
    return this.channelService.joinChannel(request.user.id, joinChannelRequest)
  }

  @Post(':channelId/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Auth()
  async leaveChannel(@Req() request, @Param('channelId') channelId: string): Promise<void> {
    return this.channelService.leaveChannel(request.user.id, channelId)
  }
}
