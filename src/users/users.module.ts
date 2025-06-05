import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';

/**
 * The UsersModule bundles all user-related components.
 *
 * - Imports the MongooseModule for the User schema.
 * - Provides the UsersService for user management and data access.
 * - Exports the UsersService for use in other modules.
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
