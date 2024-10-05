import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { AppAuthGuard } from '../guards'

export function Auth(): MethodDecorator {
  return applyDecorators(
    UseGuards(AppAuthGuard()),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized ' }),
  )
}
