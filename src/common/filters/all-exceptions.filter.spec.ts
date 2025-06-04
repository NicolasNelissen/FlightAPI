import { ArgumentsHost, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    filter = new AllExceptionsFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      url: '/test-url',
    };

    mockArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse as Response,
        getRequest: () => mockRequest as Request,
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    } as unknown as ArgumentsHost;
  });

  it('should return 400 with "Invalid payload" for BadRequestException with JSON message', () => {
    const exception = new BadRequestException('Unexpected token in JSON at position 10');

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid payload',
    });
  });

  it('should return proper status and message for generic HttpException', () => {
    const exception = new HttpException({ message: 'Custom error message' }, HttpStatus.FORBIDDEN);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.FORBIDDEN,
      message: 'Custom error message',
    });
  });

  it('should return 500 and generic message for unknown exceptions', () => {
    const exception = new Error('Unknown error');

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        path: '/test-url',
      }),
    );
  });
});
