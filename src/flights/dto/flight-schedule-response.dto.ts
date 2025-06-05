import { Exclude, Expose } from 'class-transformer';

/**
 * Data Transfer Object for returning flight schedule information in API responses.
 *
 * Exposes only the standard departure (std) and standard arrival (sta) times.
 * Uses class-transformer to control serialization.
 */
@Exclude()
export class FlightScheduleResponseDto {
  /**
   * Scheduled time of departure (ISO 8601 format).
   */
  @Expose()
  std: string;

  /**
   * Scheduled time of arrival (ISO 8601 format).
   */
  @Expose()
  sta: string;
}
