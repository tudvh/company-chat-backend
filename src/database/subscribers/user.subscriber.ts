import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm'

import { BcryptUtil } from '@/common/utils'
import { User } from '../entities'

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    const entity = event.entity
    if (entity.password) {
      entity.password = await BcryptUtil.hashPassword(entity.password)
    }
  }

  async beforeUpdate(event: UpdateEvent<User>): Promise<void> {
    const entity = event.entity
    if (entity.password) {
      entity.password = await BcryptUtil.hashPassword(entity.password)
    }
  }
}
