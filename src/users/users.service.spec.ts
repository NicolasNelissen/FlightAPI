import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockSave = jest.fn();
  const mockComparePassword = jest.fn();

  const mockUser = {
    _id: 'user-id',
    username: 'testuser',
    password: 'hashedpass',
    comparePassword: mockComparePassword,
    save: mockSave,
  };

  const MockUserModel = jest.fn().mockImplementation((data) => ({
    ...data,
    save: mockSave,
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: Object.assign(MockUserModel, {
            findOne: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUsername', () => {
    it('should find a user by username', async () => {
      const userModel = service['userModel'];
      (userModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findByUsername('testuser');

      expect(userModel.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create and save a new user for strong password', async () => {
      mockSave.mockResolvedValue(mockUser);

      const result = await service.create('testuser', 'StrongPass123!');

      expect(result).toEqual(mockUser);
      expect(mockSave).toHaveBeenCalled();
    });

    it('should throw BadRequestException if password is too weak', async () => {
      await expect(service.create('testuser', 'weakpass')).rejects.toThrow(BadRequestException);

      expect(mockSave).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should return user if password matches', async () => {
      const userModel = service['userModel'];
      (userModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      mockComparePassword.mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'correctpass');

      expect(result).toEqual(mockUser);
      expect(mockComparePassword).toHaveBeenCalledWith('correctpass');
    });

    it('should return null if user not found', async () => {
      const userModel = service['userModel'];
      (userModel.findOne as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      const result = await service.validateUser('nouser', 'any');

      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const userModel = service['userModel'];
      (userModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      mockComparePassword.mockResolvedValue(false);

      const result = await service.validateUser('testuser', 'wrongpass');

      expect(result).toBeNull();
    });
  });
});
