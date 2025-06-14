import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../src/auth/auth.module';
import { FlightsModule } from '../src/flights/flights.module';
import { UsersModule } from '../src/users/users.module';

/**
 * The root application module.
 *
 * - Loads environment variables using ConfigModule (with support for production and local environments).
 * - Connects to MongoDB using MongooseModule.
 * - Imports AuthModule, UsersModule, and FlightsModule for authentication, user, and flight management.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/flight-api'),
    AuthModule,
    UsersModule,
    FlightsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
