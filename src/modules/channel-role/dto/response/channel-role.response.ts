import { Expose } from 'class-transformer'

export class ChannelRoleResponse {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  createdAt: string
}
