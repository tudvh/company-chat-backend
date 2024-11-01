import { Repository } from 'typeorm'

import { Group } from '@/database/entities'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateGroupRequest } from './dto/request'
import { plainToInstance } from 'class-transformer'
import { GroupResponse } from './dto/response'

@Injectable()
export class GroupService {
  constructor(@InjectRepository(Group) private readonly groupRepository: Repository<Group>) {}

  public async createGroup(createGroupRequest: CreateGroupRequest): Promise<GroupResponse> {
    const group = this.groupRepository.create(createGroupRequest)
    await this.groupRepository.save(group)

    return plainToInstance(GroupResponse, group, {
      excludeExtraneousValues: true,
    })
  }
}
