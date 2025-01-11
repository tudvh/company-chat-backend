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
import { RoleUserResponse } from '../user/dto/response'
import { ChannelService } from './channel.service'
import { CreateChannelRequest, JoinChannelRequest, UpdateChannelRequest } from './dto/request'
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

  @Post(':channelId/update')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: ChannelResponse })
  @UseInterceptors(FileInterceptor('logo', { fileFilter: UploadUtil.imageFileFilter() }))
  @Auth()
  async updateInfoChannel(
    @Body() updateChannelRequest: UpdateChannelRequest,
    @UploadedFile() logo: Express.Multer.File,
    @Param('channelId') channelId: string,
  ): Promise<boolean> {
    const result = await this.channelService.updateChannel(updateChannelRequest, logo, channelId)
    return result
  }

  @Get(':channelId/users')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: RoleUserResponse })
  @Auth()
  async getAllUsersInChannel(@Param('channelId') channelId: string): Promise<RoleUserResponse[]> {
    return this.channelService.getAllUsersInChannel(channelId)
  }
}
