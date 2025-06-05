import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard for protecting routes using JWT authentication.
 *
 * Extends the default NestJS AuthGuard with the 'jwt' strategy.
 * Use this guard to require a valid JWT token for access to protected endpoints.
 *
 * @example
 *   @UseGuards(JwtAuthGuard)
 *   @Get('profile')
 *   getProfile(@CurrentUser() user: ValidatedJwtData) {
 *     return user;
 *   }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
