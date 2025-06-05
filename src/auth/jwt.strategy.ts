import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../../src/users/users.service';
import { JwtPayload } from './dto/jwt-payload.dto';
import { ValidatedJwtData } from './dto/jwt-validated-data.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Validates the JWT payload and ensures the user exists.
   *
   * @param payload - The decoded JWT payload.
   * @returns The validated user data to attach to the request.
   * @throws UnauthorizedException if the user does not exist.
   */
  async validate(payload: JwtPayload): Promise<ValidatedJwtData> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    // req.user
    return { userId: payload.sub, username: payload.username };
  }
}
