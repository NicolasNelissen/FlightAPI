import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

class BaseLoginDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto extends PartialType(BaseLoginDto) {
  @ApiProperty({ example: 'testuser', description: 'The username of the user' })
  username: string;

  @ApiProperty({ example: 'pass1234', description: 'The password of the user' })
  password: string;
}
