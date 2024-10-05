import { HttpStatus, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { WinstonModule, utilities } from 'nest-winston'
import * as winston from 'winston'

import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './common/exceptions/global.exception'
import { RequestLoggingInterceptor } from './common/interceptors/logger.interceptor'

async function bootstrap() {
  // Configure Winston logger with a console transport and specific formatting.
  const winstonLogger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          utilities.format.nestLike(),
        ),
      }),
    ],
  })

  // Create a new instance of the NestJS application using the AppModule
  // and pass the configured Winston logger.
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  })

  // Retrieve the configuration service to access environment variables or configurations.
  const configService = app.get(ConfigService)

  // Configure Swagger for API documentation.
  const swaggerOptions = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup('api', app, swaggerDocument)

  // Enable CORS for the application, allowing requests from the specified origin.
  app.enableCors({
    origin: [configService.get('APP_URL')],
  })

  // Use global pipes for validation and transformation, setting HTTP status to 400 on validation errors,
  // transforming input data types, and forbidding properties that are not explicitly allowed.
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  // Apply a global interceptor to log each request.
  app.useGlobalInterceptors(new RequestLoggingInterceptor())

  // Apply a global exception filter to handle all uncaught exceptions.
  app.useGlobalFilters(new GlobalExceptionFilter())

  // Start the application and listen on the configured port.
  const port = configService.get('APP_PORT')
  const apiUrl = configService.get('APP_API_URL')
  await app.listen(port, () => {
    console.log(`Server is running on ${apiUrl}`)
  })
}

bootstrap()
