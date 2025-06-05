import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../../src/users/users.service';
import { ValidatedJwtData } from './dto/jwt-validated-data.dto';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let usersService: Partial<UsersService>;
  let configService: Partial<ConfigService>;

  const mockUser = { id: 'user123', username: 'testuser' };

  beforeEach(() => {
    usersService = {
      findById: jest.fn(),
    };

    configService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_SECRET') return 'mock-secret';
      }),
    };

    jwtStrategy = new JwtStrategy(configService as ConfigService, usersService as UsersService);
  });

  it('should throw if JWT_SECRET is not defined', () => {
    const configMock = {
      get: jest.fn(() => undefined),
    };

    expect(
      () => new JwtStrategy(configMock as unknown as ConfigService, usersService as UsersService),
    ).toThrow('JWT_SECRET is not defined in environment variables');
  });

  it('should return validated user data when user is found', async () => {
    (usersService.findById as jest.Mock).mockResolvedValue(mockUser);

    const payload = {
      sub: mockUser.id,
      username: mockUser.username,
    };

    const result = await jwtStrategy.validate(payload);
    expect(result).toEqual<ValidatedJwtData>({
      userId: mockUser.id,
      username: mockUser.username,
    });
    expect(usersService.findById).toHaveBeenCalledWith(mockUser.id);
  });

  it('should throw UnauthorizedException when user is not found', async () => {
    (usersService.findById as jest.Mock).mockResolvedValue(null);

    const payload = { sub: 'invalidUserId', username: 'ghost' };

    await expect(jwtStrategy.validate(payload)).rejects.toThrow(UnauthorizedException);
    expect(usersService.findById).toHaveBeenCalledWith('invalidUserId');
  });
});
