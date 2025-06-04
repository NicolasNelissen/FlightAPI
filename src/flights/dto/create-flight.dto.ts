import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsISO8601, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';

class ScheduleDto {
  @ApiProperty({ format: 'date-time' })
  @IsISO8601()
  std: string;

  @ApiProperty({ format: 'date-time' })
  @IsISO8601()
  sta: string;
}

export class CreateFlightDto {
  @ApiProperty({ example: 'CSTRC' })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  aircraft: string;

  @ApiProperty({ example: 'AVIO201' })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  flightNumber: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule: ScheduleDto;

  @ApiProperty({ example: 'LPPD' })
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  departure: string;

  @ApiProperty({ example: 'LPLA' })
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  destination: string;
}
