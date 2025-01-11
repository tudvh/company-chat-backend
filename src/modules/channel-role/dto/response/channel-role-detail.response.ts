import { Expose } from 'class-transformer'

export class ChannelRoleDetailResponse {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  createdAt: string
}
