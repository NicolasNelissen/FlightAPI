/**
 * JWT authentication strategy.
 *
 * Validates JWT tokens and attaches the authenticated user to the request.
 * - Uses the JWT secret from environment variables via ConfigService.
 * - Extracts the JWT from the Authorization header as a Bearer token.
 * - Validates the user exists in the database for the given JWT payload.
 *
 * Throws an UnauthorizedException if the user does not exist or the token is invalid.
 */
export interface JwtPayload {
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
}
