import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { ChannelResponse } from './dto/response'

@Controller('channels')
@ApiTags('Channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  @ApiOkResponse({ type: ChannelResponse })
  @HttpCode(HttpStatus.OK)
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

  @Get('/my-channels')
  @ApiOkResponse({ type: [ChannelResponse] })
  @HttpCode(HttpStatus.OK)
  @Auth()
  async getMyChannels(@Req() request): Promise<ChannelResponse[]> {
    return this.channelService.getMyChannels(request.user.id)
  }
}
