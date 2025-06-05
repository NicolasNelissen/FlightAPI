import { getSchemaPath } from '@nestjs/swagger';

import { Flight } from './flight.schema';

/**
 * OpenAPI schema for the flight response object.
 *
 * Combines the Flight schema with an additional 'id' property
 * (as a string) to represent the internal identifier for the flight.
 * This schema is used for API documentation and response validation.
 */
export const flightResponseSchema = {
  allOf: [
    { $ref: getSchemaPath(Flight) },
    {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Internal Identifier for the flight' },
      },
    },
  ],
};
