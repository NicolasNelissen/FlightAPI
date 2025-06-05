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

/**
 * Controller for authentication endpoints.
 *
 * Provides endpoints for user login and registration.
 *
 * - POST /auth: Authenticate a user and return a JWT token.
 * - POST /auth/register: Register a new user.
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Authenticates a user and returns a JWT token.
   *
   * @param loginDto - The login credentials (username and password).
   * @returns An object containing the JWT token.
   * @throws UnauthorizedException if credentials are invalid.
   */
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

  /**
   * Registers a new user.
   *
   * @param registerDto - The registration data (username and password).
   * @returns The newly created user's id and username.
   * @throws ConflictException if the username is already taken.
   */
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
