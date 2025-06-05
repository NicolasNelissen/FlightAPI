import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import mongoose, { Document } from 'mongoose';

/**
 * Mongoose schema for a user document.
 *
 * Represents a user with a unique username, hashed password, and timestamps for creation and last update.
 * Includes a method for comparing passwords using bcrypt.
 */
@Schema()
export class User extends Document {
  /**
   * The unique identifier for the user.
   */
  declare _id: mongoose.Types.ObjectId;

  /**
   * The unique username for the user.
   */
  @Prop({ required: true, unique: true })
  username: string;

  /**
   * The user's hashed password.
   */
  @Prop({ required: true })
  password: string;

  /**
   * Timestamp when the user was created.
   */
  @Prop({ default: Date.now })
  createdAt: Date;

  /**
   * Timestamp when the user was last updated.
   */
  @Prop({ default: Date.now })
  updatedAt: Date;

  /**
   * Compares a candidate password with the user's hashed password.
   * @param candidate - The plain text password to compare.
   * @returns Promise resolving to true if the passwords match, false otherwise.
   */
  comparePassword: (candidate: string) => Promise<boolean>;
}

/**
 * The Mongoose document type for a user.
 */
export type UserDocument = User & Document;

/**
 * The Mongoose schema for the User class.
 */
export const UserSchema = SchemaFactory.createForClass(User);

/**
 * Pre-save hook to hash the password and update the 'updatedAt' timestamp before saving a user document.
 */
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(
    process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) : 12,
  );
  this.password = await bcrypt.hash(this.password, salt);
  this.updatedAt = new Date();
  next();
});

/**
 * Compares a candidate password with the user's hashed password.
 * @param candidate - The plain text password to compare.
 * @returns Promise resolving to true if the passwords match, false otherwise.
 */
UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};
