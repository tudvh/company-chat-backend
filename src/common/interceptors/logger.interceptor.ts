import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { format } from 'date-fns'
import { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'

import { DATE_FORMAT } from '../constants'

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP_REQUEST')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpRequest = context.switchToHttp().getRequest()
    const httpResponse = context.switchToHttp().getResponse()
    const requestStartTime = Date.now()

    return next.handle().pipe(
      tap(() => {
        if (httpRequest.url) {
          this.logger.log(
            this.formatLogMessage(
              httpRequest,
              httpResponse.statusCode,
              requestStartTime,
              Date.now(),
            ),
          )
        }
      }),
      catchError(error => {
        if (httpRequest.url) {
          const statusCode = error.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR
          this.logger.error(
            this.formatLogMessage(httpRequest, statusCode, requestStartTime, Date.now()),
            error.stack,
          )
        }
        throw error
      }),
    )
  }

  private formatLogMessage(
    httpRequest: any,
    statusCode: number,
    requestStartTime: number,
    requestEndTime: number,
  ): string {
    return (
      `[${format(Date.now(), DATE_FORMAT.DATE_TIME_DASH)}] ` +
      `API: ${httpRequest.url} - ` +
      `METHOD: ${httpRequest.method} - ` +
      `USER_ID: ${httpRequest.user ? httpRequest.user.id : 'N/A'} - ` +
      `BODY: ${JSON.stringify(httpRequest.body)} - ` +
      `STATUS_CODE: ${statusCode} - ` +
      `TIME: ${requestEndTime - requestStartTime} ms`
    )
  }
}
