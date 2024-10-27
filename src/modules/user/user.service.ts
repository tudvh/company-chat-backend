import { Injectable } from '@nestjs/common'

import { URL_EXPIRATION } from '@/common/constants'
import { User } from '@/database/entities'
import { CloudinaryService } from '../cloudinary/cloudinary.service'

@Injectable()
export class UserService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  public getAvatarUrl(user: User): string | null {
    if (user.avatarPublicId) {
      return this.cloudinaryService.generateSignedImageUrl(
        user.avatarPublicId,
        URL_EXPIRATION.USER_AVATAR,
      )
    }
    if (user.avatarUrl) {
      return user.avatarUrl
    }
    return null
  }
}
