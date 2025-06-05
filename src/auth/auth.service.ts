import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

/**
 * Service for authentication logic.
 *
 * Handles user validation and JWT token generation.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates a user's credentials.
   *
   * @param username - The username to validate.
   * @param password - The plain text password to validate.
   * @returns The User document if credentials are valid.
   * @throws UnauthorizedException if credentials are invalid.
   */
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);

    if (user && (await user.comparePassword(password))) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  /**
   * Authenticates a user and returns a JWT token.
   *
   * @param loginDto - The login credentials (username and password).
   * @returns The JWT token as a string, or null if authentication fails.
   */
  async login(loginDto: LoginDto): Promise<string | null> {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) return null;

    const payload = { sub: user._id.toString(), username: user.username };
    return this.jwtService.signAsync(payload);
  }
}
