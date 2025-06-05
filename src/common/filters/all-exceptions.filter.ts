import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { extractHttpExceptionMessage } from '../utilities/httpException.util';

/**
 * Global exception filter for NestJS applications.
 *
 * This filter standardizes error responses for all exceptions thrown during HTTP request processing.
 *
 * - Returns a 400 response with a custom message for BadRequestExceptions related to invalid JSON payloads.
 * - Returns the status and message for all other HttpExceptions.
 * - Returns a 500 response with a generic message for all other (non-HTTP) exceptions.
 *
 * Example responses:
 *   { "statusCode": 400, "message": "Invalid payload" }
 *   { "statusCode": 404, "message": "Flight not found" }
 *   { "statusCode": 500, "message": "Something went wrong" }
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  /**
   * Handles exceptions and sends a standardized JSON response.
   *
   * @param exception - The exception thrown during request handling.
   * @param host - Provides access to the underlying platform and request/response objects.
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

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
    });
  }
}
