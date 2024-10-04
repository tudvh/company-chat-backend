import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Request, Response } from 'express'

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  constructor() {
    super()
  }

  catch(exception: any, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      const httpContext = host.switchToHttp()
      const response = httpContext.getResponse<Response>()
      const request = httpContext.getRequest<Request>()
      const status = exception.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR
      let errorMessage = ''

      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        errorMessage = 'Internal server error'
      } else {
        errorMessage = exception.response?.message || exception.message || 'Internal server error'
      }

      this.logger.error(`[${request.method}] ${request.url} - ${errorMessage}`, exception.stack)

      response.status(status).json({
        message: errorMessage,
      })
    } else {
      super.catch(exception, host)
    }
  }
}
