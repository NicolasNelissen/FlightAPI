import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';

import { Schedule } from './schedule.dto';

/**
 * Data Transfer Object for creating a new flight.
 *
 * Contains all required fields to define a flight, including aircraft, flight number,
 * schedule (with standard departure and arrival times), departure, and destination.
 */
export class Flight {
  @ApiProperty({
    description: 'A code describing the aircraft assigned to the flight',
    example: 'CSTRC',
    minLength: 1,
    maxLength: 10,
    required: false,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  aircraft?: string;

  @ApiProperty({
    description: 'A code that identifies the flight',
    example: 'AVIO201',
    minLength: 1,
    maxLength: 10,
    required: false,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  flightNumber?: string;

  @ApiProperty({
    description: 'Flight schedule, including standard departure and arrival times.',
    type: Schedule,
    required: false,
  })
  @ValidateNested()
  @Type(() => Schedule)
  schedule?: Schedule;

  @ApiProperty({
    description: 'Identifier for the departure airport',
    example: 'LPPD',
    minLength: 4,
    maxLength: 4,
    required: false,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  departure?: string;

  @ApiProperty({
    description: 'Identifier for the destination airport',
    example: 'LPLA',
    minLength: 4,
    maxLength: 4,
    required: false,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  destination?: string;
}
