import { Exclude, Expose, Transform, Type } from 'class-transformer';

import { FlightScheduleResponseDto } from './flight-schedule-response.dto';

/**
 * Data Transfer Object for returning flight information in API responses.
 *
 * Exposes only selected flight properties, including id, aircraft, flight number,
 * schedule, departure, and destination. Uses class-transformer to control serialization.
 */
@Exclude()
export class FlightResponseDto {
  /**
   * Unique identifier for the flight.
   */
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  /**
   * Aircraft registration or identifier.
   */
  @Expose()
  aircraft: string;

  /**
   * Flight number.
   */
  @Expose()
  flightNumber: string;

  /**
   * Flight schedule, including standard departure and arrival times.
   */
  @Expose()
  @Type(() => FlightScheduleResponseDto)
  schedule: FlightScheduleResponseDto;

  /**
   * Departure airport ICAO code.
   */
  @Expose()
  departure: string;

  /**
   * Destination airport ICAO code.
   */
  @Expose()
  destination: string;
}
