import { Request } from 'express';

import { ValidatedJwtData } from '../../../src/auth/dto/jwt-validated-data.dto';

/**
 * Extends the Express Request type to optionally include a user property
 * containing validated JWT data.
 */
export type CustomRequest = Request & {
  user?: ValidatedJwtData;
};

/**
 * Extends CustomRequest to require a user property with validated JWT data.
 * Use this type when you are certain the request is authenticated.
 */
export type ValidatedRequest = CustomRequest & {
  user: ValidatedJwtData;
};
