import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsISO8601, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';

/**
 * Data Transfer Object representing a flight schedule.
 *
 * Contains standard departure (std) and standard arrival (sta) times in ISO 8601 format.
 */
class ScheduleDto {
  /**
   * Scheduled time of departure (ISO 8601 format).
   */
  @ApiProperty({ format: 'date-time' })
  @IsISO8601()
  std: string;

  /**
   * Scheduled time of arrival (ISO 8601 format).
   */
  @ApiProperty({ format: 'date-time' })
  @IsISO8601()
  sta: string;
}

/**
 * Data Transfer Object for creating a new flight.
 *
 * Contains all required fields to define a flight, including aircraft, flight number,
 * schedule (with standard departure and arrival times), departure, and destination.
 */
export class CreateFlightDto {
  /**
   * Aircraft registration or identifier.
   * @example "CSTRC"
   */
  @ApiProperty({ example: 'CSTRC' })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  aircraft: string;

  /**
   * Flight number.
   * @example "AVIO201"
   */
  @ApiProperty({ example: 'AVIO201' })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  flightNumber: string;

  /**
   * Flight schedule, including standard departure and arrival times.
   */
  @ApiProperty()
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule: ScheduleDto;

  /**
   * Departure airport ICAO code.
   * @example "LPPD"
   */
  @ApiProperty({ example: 'LPPD' })
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  departure: string;

  /**
   * Destination airport ICAO code.
   * @example "LPLA"
   */
  @ApiProperty({ example: 'LPLA' })
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  destination: string;
}
