import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'testuser', description: 'The username of the user' })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @ApiProperty({ example: 'pass1234', description: 'The password of the user' })
  @IsString()
  @MinLength(6)
  password: string;
}
