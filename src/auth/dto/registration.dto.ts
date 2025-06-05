import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export const passwordErrorMessage =
  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';

export const usernameErrorMessage =
  'Username can only contain letters, numbers, and underscores, and must be between 3 and 20 characters long';

/**
 * Data Transfer Object for user registration.
 *
 * Contains validation rules for username and password fields.
 * - Username: 3-20 characters, only lowercase letters, numbers, and underscores.
 * - Password: Minimum 8 characters, must include uppercase, lowercase, number, and special character.
 */
export class Registration {
  /**
   * Unique username for the user.
   * Must be 3-20 characters and contain only lowercase letters, numbers, and underscores.
   * @example "newuser"
   */
  @ApiProperty({ example: 'newuser', description: 'Unique username for the user' })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-z0-9_]+$/, {
    message: usernameErrorMessage,
  })
  username: string;

  /**
   * User password.
   * Must be at least 8 characters and contain uppercase, lowercase, number, and special character.
   * @example "strongPassword123"
   */
  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: passwordErrorMessage,
  })
  password: string;
}
