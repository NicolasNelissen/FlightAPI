import { ApiParamOptions } from '@nestjs/swagger';

/**
 * Reusable ObjectId param for Swagger documentation.
 * @param name - Name of the route parameter
 * @param description - Optional description for the parameter
 */
export const ObjectIdParam = (name: string, description = 'MongoDB ObjectId'): ApiParamOptions => ({
  name,
  required: true,
  description,
  schema: {
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
    example: '507f1f77bcf86cd799439011',
  },
});
