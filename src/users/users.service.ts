import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';

/**
 * Service for managing user resources.
 *
 * Provides business logic and data access for creating, retrieving, and validating users.
 * Handles password validation and hashing, and interacts with the User Mongoose model.
 */
@Injectable()
export class UsersService {
  /**
   * Regular expression for validating password complexity.
   * Requires at least one uppercase letter, one lowercase letter, one number, and one special character.
   */
  private passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Finds a user by their username.
   *
   * @param username - The username to search for.
   * @returns The User document, or null if not found.
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  /**
   * Finds a user by their ID.
   *
   * @param id - The ID of the user to find.
   * @returns The User document, or null if not found.
   */
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).lean().exec();
  }

  /**
   * Creates a new user with the specified username and password.
   * Validates password complexity before saving.
   *
   * @param username - The username for the new user.
   * @param password - The plain text password for the new user.
   * @returns The created User document.
   * @throws BadRequestException if the password does not meet complexity requirements.
   */
  async create(username: string, password: string): Promise<User> {
    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    if (!this.passwordRegex.test(password)) {
      throw new BadRequestException(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      );
    }

    const user = new this.userModel({ username, password });

    return user.save();
  }

  /**
   * Validates a user's credentials.
   *
   * @param username - The username to validate.
   * @param password - The plain text password to validate.
   * @returns The User document if credentials are valid, or null otherwise.
   */
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findByUsername(username);

    if (user && (await user.comparePassword(password))) {
      return user;
    }

    return null;
  }
}
