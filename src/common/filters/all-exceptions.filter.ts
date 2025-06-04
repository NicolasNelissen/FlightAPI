import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { extractHttpExceptionMessage } from '../utilities/httpException.util';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof BadRequestException && exception.message.includes('JSON')) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Invalid payload',
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = extractHttpExceptionMessage(exception.getResponse());

      return response.status(status).json({
        statusCode: status,
        message,
      });
    }

    // since this is our only way to look into the exceptions,
    // make an exception for development purposes
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-undef, no-console
      console.log(exception);
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    const message = 'Something went wrong';

    const additionalInfo =
      process.env.NODE_ENV === 'development'
        ? { path: request.url, timestamp: new Date().toISOString() }
        : undefined;

    response.status(status).json({
      statusCode: status,
      message,
      ...(additionalInfo && additionalInfo),
    });
  }
}
