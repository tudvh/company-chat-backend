import { AuthGuard, IAuthGuard, Type } from '@nestjs/passport'

export function AppAuthGuard(): Type<IAuthGuard> {
  const strategies = ['jwt']

  return AuthGuard(strategies)
}
