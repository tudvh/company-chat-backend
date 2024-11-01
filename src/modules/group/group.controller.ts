import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { Auth } from '@/common/decorators'
import { CreateGroupRequest } from './dto/request'
import { GroupResponse } from './dto/response'
import { GroupService } from './group.service'

@Controller('groups')
@ApiTags('Group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: GroupResponse })
  @Auth()
  async createGroup(@Body() createGroupRequest: CreateGroupRequest): Promise<GroupResponse> {
    const result = await this.groupService.createGroup(createGroupRequest)
    return result
  }
}
