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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { Auth } from '@/common/decorators'
import { UploadUtil } from '@/common/utils'
import { ChannelService } from './channel.service'
import { CreateChannelRequest } from './dto/request'
import { ChannelDetailResponse, ChannelResponse } from './dto/response'

@Controller('channels')
@ApiTags('Channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: ChannelResponse })
  @UseInterceptors(FileInterceptor('thumbnailFile', { fileFilter: UploadUtil.imageFileFilter() }))
  @Auth()
  async createChannel(
    @Body() createChannelRequest: CreateChannelRequest,
    @Req() request,
    @UploadedFile() thumbnailFile: Express.Multer.File,
  ): Promise<ChannelResponse> {
    const result = await this.channelService.createChannel(
      createChannelRequest,
      request.user.id,
      thumbnailFile,
    )
    return result
  }

  @Get('/jointed')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [ChannelResponse] })
  @Auth()
  async getJointedChannels(@Req() request): Promise<ChannelResponse[]> {
    return this.channelService.getJointedChannels(request.user.id)
  }

  @Get('/jointed/:channelId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChannelDetailResponse })
  @Auth()
  async getJointedChannelDetail(
    @Req() request,
    @Param('channelId') channelId: string,
  ): Promise<ChannelDetailResponse> {
    return this.channelService.getJointedChannelDetail(request.user.id, channelId)
  }
}
