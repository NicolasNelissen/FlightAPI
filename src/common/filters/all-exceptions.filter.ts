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

    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    const message = 'Something went wrong';

    response.status(status).json({
      statusCode: status,
      message,
      // TODO: remove this
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
