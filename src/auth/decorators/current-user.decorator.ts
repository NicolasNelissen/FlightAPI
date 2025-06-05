import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomRequest } from 'src/common/types/customRequest.type';

export function extractUserFromRequest(ctx: ExecutionContext) {
  const request: CustomRequest = ctx.switchToHttp().getRequest();

  if (!request.user) {
    throw new Error('User not found in request');
  }

  if (!request.user.userId || !request.user.username) {
    throw new Error('Invalid user data in request');
  }

  return request.user;
}

/**
 * Custom parameter decorator to extract the current authenticated user from the request.
 *
 * Usage: Place `@CurrentUser()` in a controller method parameter to inject the validated user object.
 *
 * Throws an error if the user is not present or if required user properties are missing.
 *
 * @throws Error if user is not found in the request or user data is invalid.
 * @returns The user object attached to the request.
 *
 * @example
 *   @Get('profile')
 *   getProfile(@CurrentUser() user: ValidatedJwtData) {
 *     return user;
 *   }
 */
export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext) => {
  return extractUserFromRequest(ctx);
});
