import { Module } from '@nestjs/common'

import { CloudinaryModule } from '../cloudinary/cloudinary.module'
import { UserService } from './user.service'

@Module({
  imports: [CloudinaryModule],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
