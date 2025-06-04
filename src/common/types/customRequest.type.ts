import { Request } from 'express';
import { JwtData } from 'src/auth/jwt.strategy';

export type CustomRequest = Request & JwtData;
