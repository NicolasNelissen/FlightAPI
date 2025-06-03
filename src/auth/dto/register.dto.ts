import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export const passwordErrorMessage =
  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';

export const usernameErrorMessage =
  'Username can only contain letters, numbers, and underscores, and must be between 3 and 20 characters long';

class BaseRegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: usernameErrorMessage,
  })
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: passwordErrorMessage,
  })
  password: string;
}

export class RegisterDto extends PartialType(BaseRegisterDto) {
  @ApiProperty({ example: 'newuser', description: 'Unique username for the user' })
  username: string;

  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  password: string;
}
