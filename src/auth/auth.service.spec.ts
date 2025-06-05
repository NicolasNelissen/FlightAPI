import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';

import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let userModel: Model<User>;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockUsersService = {
    findByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test', {
          connectionName: 'auth-test',
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }], 'auth-test'),
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get<Model<User>>(getModelToken(User.name, 'auth-test'));
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await userModel.db.dropDatabase();
    await userModel.db.close();
  });

  describe('validateUser', () => {
    const username = 'testuser';
    const password = 'testpass';

    it('should return user if password matches', async () => {
      const user: Partial<User> = {
        _id: new Types.ObjectId(),
        username,
        password: 'hashed',
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      mockUsersService.findByUsername.mockResolvedValue(user);

      const result = await authService.validateUser(username, password);

      expect(usersService.findByUsername).toHaveBeenCalledWith(username);
      expect(user.comparePassword).toHaveBeenCalledWith(password);
      expect(result).toEqual(user);
    });

    it('should throw if user not found', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);

      await expect(authService.validateUser(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if password does not match', async () => {
      const user = {
        _id: 'some-id',
        username,
        password: 'hashed',
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      mockUsersService.findByUsername.mockResolvedValue(user);

      await expect(authService.validateUser(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should return a signed JWT token for valid credentials', async () => {
      const loginDto = { username: 'testuser', password: 'testpass' };
      const user: Partial<User> = {
        _id: new Types.ObjectId(),
        username: loginDto.username,
        password: 'hashed-password',
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      const token = 'jwt-token';

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user as User);
      mockJwtService.signAsync.mockResolvedValue(token);

      const result = await authService.login(loginDto);

      expect(authService.validateUser).toHaveBeenCalledWith(loginDto.username, loginDto.password);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: user._id?.toString(),
        username: user.username,
      });
      expect(result).toBe(token);
    });

    it('should return null for invalid credentials', async () => {
      const loginDto = { username: 'testuser', password: 'wrongpass' };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      const result = await authService.login(loginDto);

      expect(result).toBeNull();
    });
  });
});
