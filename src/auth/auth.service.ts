import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);

    if (user && (await user.comparePassword(password))) {
      return user;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async login(loginDto: LoginDto): Promise<string | null> {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) return null;

    const payload = { sub: user._id.toString(), username: user.username };
    return this.jwtService.signAsync(payload);
  }
}
