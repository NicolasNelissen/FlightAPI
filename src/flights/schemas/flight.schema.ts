import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601 } from 'class-validator';
import mongoose, { Document } from 'mongoose';

/**
 * Mongoose schema for a flight schedule subdocument.
 *
 * Represents the standard departure (std) and arrival (sta) times for a flight.
 * Disables the version key and id for subdocuments to prevent extra fields like __v and id.
 */
@Schema({ versionKey: false, id: false })
export class FlightSchedule {
  /**
   * Scheduled time of departure (ISO 8601 format).
   */
  @ApiProperty({ format: 'date-time' })
  @IsISO8601()
  @Prop({ required: true })
  std: Date;

  /**
   * Scheduled time of arrival (ISO 8601 format).
   */
  @ApiProperty({ format: 'date-time' })
  @IsISO8601()
  @Prop({ required: true })
  sta: Date;
}

/**
 * Mongoose schema for a flight document.
 *
 * Represents a flight with aircraft, flight number, schedule, departure, destination,
 * user reference, and timestamps for creation and last update.
 */
@Schema()
export class Flight extends Document {
  declare _id: mongoose.Types.ObjectId;

  /**
   * Aircraft registration or identifier.
   * @example "CSTRC"
   */
  @ApiProperty({ example: 'CSTRC' })
  @Prop({ required: true, minlength: 1, maxlength: 10 })
  aircraft: string;

  /**
   * Flight number.
   * @example "AVIO201"
   */
  @ApiProperty({ example: 'AVIO201' })
  @Prop({ required: true, minlength: 1, maxlength: 10, index: true })
  flightNumber: string;

  /**
   * Flight schedule, including standard departure and arrival times.
   * @example { std: '2024-08-01T10:00:00Z', sta: '2024-08-01T12:00:00Z' }
   */
  @ApiProperty({
    example: { std: '2024-08-01T10:00:00Z', sta: '2024-08-01T12:00:00Z' },
  })
  @Prop({ type: FlightSchedule, required: true })
  schedule: FlightSchedule;

  /**
   * Departure airport ICAO code.
   * @example "LPPD"
   */
  @ApiProperty({ example: 'LPPD' })
  @Prop({ required: true, minlength: 4, maxlength: 4 })
  departure: string;

  /**
   * Destination airport ICAO code.
   * @example "LPLA"
   */
  @ApiProperty({ example: 'LPLA' })
  @Prop({ required: true, minlength: 4, maxlength: 4 })
  destination: string;

  /**
   * Reference to the user who created the flight.
   */
  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: 'User', index: true })
  user: mongoose.Types.ObjectId;

  /**
   * Timestamp when the flight was created.
   */
  @Prop({ default: Date.now })
  createdAt: Date;

  /**
   * Timestamp when the flight was last updated.
   */
  @Prop({ default: Date.now })
  updatedAt: Date;
}

/**
 * The Mongoose schema for the Flight class.
 */
export const FlightSchema = SchemaFactory.createForClass(Flight);

/**
 * Pre-save hook to update the 'updatedAt' timestamp before saving a flight document.
 */
FlightSchema.pre<Flight>('save', function (next) {
  this.updatedAt = new Date();
  next();
});
