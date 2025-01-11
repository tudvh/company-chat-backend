import { Expose, Transform } from 'class-transformer'

export class ChannelRoleResponse {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  createdAt: string

  @Expose()
  @Transform(({ obj }) => obj.channelUsers.length)
  channelUsersLength: number
}
