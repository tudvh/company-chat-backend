import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { Auth } from '@/common/decorators'
import { ChannelRoleService } from './channel-role.service'
import {
  CreateChannelRoleRequest,
  GetChannelRolesRequest,
  UpdateChannelRolePermissionsRequest,
} from './dto/request'
import { ChannelRoleDetailResponse, ChannelRoleResponse } from './dto/response'

@Controller('channel-roles')
@ApiTags('Channel Role')
export class ChannelRoleController {
  constructor(private readonly channelRoleService: ChannelRoleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: [ChannelRoleResponse] })
  @Auth()
  async getChannelRoles(
    @Query() getChannelRolesRequest: GetChannelRolesRequest,
  ): Promise<ChannelRoleResponse[]> {
    const result = this.channelRoleService.getChannelRoles(getChannelRolesRequest)
    return result
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: ChannelRoleResponse })
  @Auth()
  async createChannelRole(
    @Body() createChannelRoleRequest: CreateChannelRoleRequest,
  ): Promise<ChannelRoleResponse> {
    const result = this.channelRoleService.createChannelRole(createChannelRoleRequest)
    return result
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: ChannelRoleDetailResponse })
  @Auth()
  async getChannelRole(@Param('id') id: string): Promise<ChannelRoleDetailResponse> {
    const result = await this.channelRoleService.getChannelRole(id)
    return result
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Auth()
  async updateChannelRole(
    @Param('id') id: string,
    @Body() createChannelRoleRequest: CreateChannelRoleRequest,
  ): Promise<void> {
    await this.channelRoleService.updateChannelRole(id, createChannelRoleRequest)
  }

  @Get(':id/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: [String] })
  @Auth()
  async getChannelRolePermissions(@Param('id') id: string): Promise<string[]> {
    const result = await this.channelRoleService.getChannelRolePermissions(id)
    return result
  }

  @Put(':id/permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Auth()
  async updateChannelRolePermissions(
    @Param('id') id: string,
    @Body() updateChannelRolePermissionsRequest: UpdateChannelRolePermissionsRequest,
  ): Promise<void> {
    await this.channelRoleService.updateChannelRolePermissions(
      id,
      updateChannelRolePermissionsRequest,
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Auth()
  async deleteChannelRole(@Param('id') id: string): Promise<void> {
    await this.channelRoleService.deleteChannelRole(id)
  }

  @Get(':id/users')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: [String] })
  @Auth()
  async getChannelRoleUser(@Param('id') id: string): Promise<string[]> {
    const result = await this.channelRoleService.getChannelRoleUsers(id)
    return result
  }

  @Post(':channelRoleId/users/:userId')
  async addUser(@Param('channelRoleId') channelRoleId: string, @Param('userId') userId: string) {
    const result = await this.channelRoleService.addUserToChannelRole(channelRoleId, userId)
    return result
  }

  @Delete(':channelRoleId/users/:userId')
  async removeUser(@Param('channelRoleId') channelRoleId: string, @Param('userId') userId: string) {
    const result = await this.channelRoleService.removeUserFromChannelRole(channelRoleId, userId)
    return result
  }
}
