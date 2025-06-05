import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';

import { AllExceptionsFilter } from '../filters/all-exceptions.filter';

/**
 * Sets up global pipes and filters for the NestJS application.
 *
 * @param app - The NestJS application instance.
 */
export function setupAppGlobals(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: () => {
        return new BadRequestException('Invalid payload');
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
}
