import { PartialType } from '@nestjs/swagger';

import { CreateFlightDto } from './create-flight.dto';

/**
 * Data Transfer Object for updating an existing flight.
 *
 * Inherits all fields from CreateFlightDto, but makes them optional for partial updates.
 * Uses NestJS Swagger's PartialType to automatically set all properties as optional.
 */
export class UpdateFlightDto extends PartialType(CreateFlightDto) {}
