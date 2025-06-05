import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Data Transfer Object for user login.
 *
 * Contains the required fields for authenticating a user: username and password.
 */
export class LoginDto {
  /**
   * The username of the user.
   * @example "testuser"
   */
  @ApiProperty({ example: 'testuser', description: 'The username of the user' })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  /**
   * The password of the user.
   * @example "pass1234"
   */
  @ApiProperty({ example: 'pass1234', description: 'The password of the user' })
  @IsString()
  @MinLength(6)
  password: string;
}
