import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a token for a user' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    schema: { example: { token: 'jwt-token-here' } },
  })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);

    if (!token) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { token };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Username already taken' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  async register(@Body() registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByUsername(registerDto.username);

    if (existingUser) {
      throw new ConflictException('Username already taken');
    }

    const user = await this.usersService.create(registerDto.username, registerDto.password);
    return { id: user._id, username: user.username };
  }
}
