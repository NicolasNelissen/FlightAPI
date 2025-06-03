import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockUsersService = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return a token on valid login', async () => {
      mockAuthService.login.mockResolvedValue('mock-token');

      const result = await controller.login({ username: 'user', password: 'pass' });

      expect(result).toEqual({ token: 'mock-token' });
    });

    it('should throw UnauthorizedException on invalid login', async () => {
      mockAuthService.login.mockResolvedValue(null);

      await expect(controller.login({ username: 'user', password: 'wrong' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create and return user if username is available', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({ _id: 'user-id', username: 'newuser' });

      const result = await controller.register({ username: 'newuser', password: 'StrongPass1!' });

      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('newuser');
      expect(mockUsersService.create).toHaveBeenCalledWith('newuser', 'StrongPass1!');
      expect(result).toEqual({ id: 'user-id', username: 'newuser' });
    });

    it('should throw ConflictException if username is taken', async () => {
      mockUsersService.findByUsername.mockResolvedValue({ username: 'existinguser' });

      await expect(
        controller.register({ username: 'existinguser', password: 'StrongPass1!' }),
      ).rejects.toThrow(ConflictException);

      expect(mockUsersService.findByUsername).toHaveBeenCalledWith('existinguser');
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });
  });
});
