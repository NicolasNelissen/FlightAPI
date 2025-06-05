import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601 } from 'class-validator';

/**
 * Data Transfer Object representing a flight schedule.
 *
 * Contains standard departure (std) and standard arrival (sta) times in ISO 8601 format.
 */
export class Schedule {
  /**
   * Scheduled time of departure (ISO 8601 format).
   */
  @ApiProperty({
    description: 'The scheduled time of departure, ISO 8601 format',
    format: 'date-time',
  })
  @IsISO8601()
  std: string;

  /**
   * Scheduled time of arrival (ISO 8601 format).
   */
  @ApiProperty({
    description: 'The scheduled time of arrival, ISO 8601 format',
    format: 'date-time',
  })
  @IsISO8601()
  sta: string;
}
