import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object representing a JWT token response.
 *
 * Returned by authentication endpoints after successful login.
 */
export class Token {
  /**
   * The JWT token string.
   * @example "jwt-token-here"
   */
  @ApiProperty({ example: 'jwt-token-here' })
  token: string;
}
