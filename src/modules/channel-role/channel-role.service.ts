import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { Not, Repository } from 'typeorm'

import { Channel, ChannelPermissionRole, ChannelRole, ChannelUser } from '@/database/entities'
import {
  CreateChannelRoleRequest,
  GetChannelRolesRequest,
  UpdateChannelRolePermissionsRequest,
} from './dto/request'
import { ChannelRoleDetailResponse, ChannelRoleResponse } from './dto/response'

@Injectable()
export class ChannelRoleService {
  constructor(
    @InjectRepository(ChannelRole) private readonly channelRoleRepository: Repository<ChannelRole>,
    @InjectRepository(Channel) private readonly channelRepository: Repository<Channel>,
    @InjectRepository(ChannelPermissionRole)
    private readonly channelPermissionRoleRepository: Repository<ChannelPermissionRole>,
    @InjectRepository(ChannelUser)
    private readonly channelUserRepository: Repository<ChannelUser>,
  ) {}

  public async getChannelRoles(
    getChannelRolesRequest: GetChannelRolesRequest,
  ): Promise<ChannelRoleResponse[]> {
    const { channelId } = getChannelRolesRequest

    const channelRoles = await this.channelRoleRepository.find({
      where: {
        channelId,
      },
      order: {
        createdAt: 'ASC',
      },
      relations: ['channelUsers'],
    })

    return plainToInstance(ChannelRoleResponse, channelRoles, {
      excludeExtraneousValues: true,
    })
  }

  public async createChannelRole(
    createChannelRoleRequest: CreateChannelRoleRequest,
  ): Promise<ChannelRoleResponse> {
    const channel = await this.channelRepository.findOneBy({
      id: createChannelRoleRequest.channelId,
    })

    if (!channel) {
      throw new BadRequestException('Không tìm thấy máy chủ')
    }

    const existingRole = await this.channelRoleRepository.findOneBy({
      channelId: createChannelRoleRequest.channelId,
      name: createChannelRoleRequest.name,
    })

    if (existingRole) {
      throw new ConflictException('Tên vai trò trong kênh đã tồn tại')
    }

    const channelRole = this.channelRoleRepository.create(createChannelRoleRequest)
    await this.channelRoleRepository.save(channelRole)

    return plainToInstance(ChannelRoleResponse, channelRole, {
      excludeExtraneousValues: true,
    })
  }

  public async getChannelRole(channelRoleId: string): Promise<ChannelRoleDetailResponse> {
    const channelRole = await this.channelRoleRepository.findOneBy({
      id: channelRoleId,
    })

    if (!channelRole) {
      throw new BadRequestException('Không tìm thấy vai trò')
    }

    return plainToInstance(ChannelRoleDetailResponse, channelRole, {
      excludeExtraneousValues: true,
    })
  }

  public async updateChannelRole(
    channelRoleId: string,
    createChannelRoleRequest: CreateChannelRoleRequest,
  ): Promise<void> {
    const channelRole = await this.channelRoleRepository.findOneBy({
      id: channelRoleId,
    })

    if (!channelRole) {
      throw new BadRequestException('Không tìm thấy vai trò')
    }

    const existingRole = await this.channelRoleRepository.findOneBy({
      id: Not(channelRoleId),
      channelId: channelRole.channelId,
      name: createChannelRoleRequest.name,
    })

    if (existingRole) {
      throw new ConflictException('Tên vai trò trong kênh đã tồn tại')
    }

    channelRole.name = createChannelRoleRequest.name

    await this.channelRoleRepository.save(channelRole)
  }

  public async getChannelRolePermissions(channelRoleId: string): Promise<string[]> {
    const permissions = await this.channelPermissionRoleRepository.find({
      where: {
        channelRoleId,
      },
      select: ['permissionId'],
    })

    return permissions.map(permission => permission.permissionId)
  }

  public async updateChannelRolePermissions(
    channelRoleId: string,
    updateChannelRolePermissionsRequest: UpdateChannelRolePermissionsRequest,
  ): Promise<void> {
    const channelRole = await this.channelRoleRepository.findOneBy({
      id: channelRoleId,
    })

    if (!channelRole) {
      throw new BadRequestException('Không tìm thấy vai trò')
    }

    await this.channelPermissionRoleRepository.delete({
      channelRoleId,
    })

    const permissions = updateChannelRolePermissionsRequest.permissions.map(permission => ({
      channelRoleId,
      permissionId: permission,
    }))

    await this.channelPermissionRoleRepository.save(permissions)
  }

  public async deleteChannelRole(channelRoleId: string): Promise<void> {
    const channelRole = await this.channelRoleRepository.findOneBy({
      id: channelRoleId,
    })

    if (!channelRole) {
      throw new BadRequestException('Không tìm thấy vai trò')
    }

    await this.channelRoleRepository.delete({
      id: channelRoleId,
    })
  }

  public async getChannelRoleUsers(channelRoleId: string): Promise<string[]> {
    const channelRole = await this.channelRoleRepository.findOne({
      where: {
        id: channelRoleId,
      },
      relations: ['channelUsers'],
    })

    if (!channelRole) {
      throw new BadRequestException('Không tìm thấy vai trò')
    }

    return channelRole.channelUsers.map(channelUser => channelUser.userId)
  }

  public async addUserToChannelRole(channelRoleId: string, userId: string): Promise<void> {
    const channelRole = await this.channelRoleRepository.findOne({
      where: {
        id: channelRoleId,
      },
      relations: ['channelUsers'],
    })

    if (!channelRole) {
      throw new BadRequestException('Không tìm thấy vai trò')
    }

    const channelUser = await this.channelUserRepository.findOne({
      where: {
        channelId: channelRole.channelId,
        userId: userId,
      },
    })

    if (!channelUser) {
      throw new BadRequestException('Không tìm thấy người dùng trong kênh')
    }

    const hasRole = channelRole.channelUsers.some(user => user.userId === userId)
    if (hasRole) {
      throw new BadRequestException('Người dùng đã có vai trò này')
    }

    channelRole.channelUsers.push(channelUser)
    await this.channelRoleRepository.save(channelRole)
  }

  public async removeUserFromChannelRole(channelRoleId: string, userId: string): Promise<void> {
    const channelRole = await this.channelRoleRepository.findOne({
      where: {
        id: channelRoleId,
      },
      relations: ['channelUsers'],
    })

    if (!channelRole) {
      throw new BadRequestException('Không tìm thấy vai trò')
    }

    const hasRole = channelRole.channelUsers.some(user => user.userId === userId)
    if (!hasRole) {
      throw new BadRequestException('Người dùng không có vai trò này')
    }

    channelRole.channelUsers = channelRole.channelUsers.filter(user => user.userId !== userId)
    await this.channelRoleRepository.save(channelRole)
  }
}
