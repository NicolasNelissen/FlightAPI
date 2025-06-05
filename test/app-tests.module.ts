import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../src/auth/auth.module';
import { FlightsModule } from '../src/flights/flights.module';
import { UsersModule } from '../src/users/users.module';

/**
 * The AppTestModule is a custom module used for end-to-end (e2e) testing.
 *
 * - Loads environment variables using ConfigModule (with support for production and local environments).
 * - Connects to a dedicated MongoDB test database using MongooseModule.
 * - Imports AuthModule, UsersModule, and FlightsModule for authentication, user, and flight management.
 * - Ensures all dependencies are available for isolated and reliable test execution.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local',
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost/flight-e2e-test'),
    AuthModule,
    UsersModule,
    FlightsModule,
  ],
})
export class AppTestModule {}
