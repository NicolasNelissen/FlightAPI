import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

/**
 * Authentication module.
 *
 * Provides authentication and authorization functionality using JWT and Passport.
 * - Registers Passport with JWT as the default strategy.
 * - Configures JwtModule asynchronously using ConfigService for secret and expiration.
 * - Imports UsersModule for user management.
 * - Exports AuthService, JwtStrategy, JwtModule, and PassportModule for use in other modules.
 */
@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
  exports: [AuthService, JwtStrategy, JwtModule, PassportModule],
})
export class AuthModule {}
