import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { Auth } from '@/common/decorators'
import { UploadUtil } from '@/common/utils'
import { GetMessageByRoomRequest, SendMessageRequest } from './dto/request'
import { MessageResponse } from './dto/response'
import { MessageService } from './message.service'

@Controller('messages')
@ApiTags('Message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('get-by-room')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [MessageResponse] })
  @Auth()
  async getAllMessagesByRoom(
    @Query() getMessageByRoomRequest: GetMessageByRoomRequest,
  ): Promise<MessageResponse[]> {
    const result = await this.messageService.getAllMessagesByRoom(getMessageByRoomRequest.roomId)
    return result
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: MessageResponse })
  @UseInterceptors(
    FilesInterceptor('attachments', 5, { fileFilter: UploadUtil.messageAttachmentFilter() }),
  )
  @Auth()
  async sendMessage(
    @Body() sendMessageRequest: SendMessageRequest,
    @Req() request,
    @UploadedFiles() attachments: Express.Multer.File[],
  ): Promise<MessageResponse> {
    const result = await this.messageService.sendMessage(
      request.user,
      sendMessageRequest,
      attachments,
    )
    return result
  }
}
