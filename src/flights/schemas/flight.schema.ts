import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601 } from 'class-validator';
import mongoose, { Document } from 'mongoose';

@Schema()
export class FlightSchedule {
  @ApiProperty({ format: 'date-time' })
  @IsISO8601()
  @Prop({ required: true })
  std: Date;

  @ApiProperty({ format: 'date-time' })
  @IsISO8601()
  @Prop({ required: true })
  sta: Date;
}

@Schema()
export class Flight extends Document {
  declare _id: mongoose.Types.ObjectId;

  @ApiProperty({ example: 'CSTRC' })
  @Prop({ required: true, minlength: 1, maxlength: 10 })
  aircraft: string;

  @ApiProperty({ example: 'AVIO201' })
  @Prop({ required: true, minlength: 1, maxlength: 10 })
  flightNumber: string;

  @ApiProperty({
    example: { std: '2024-08-01T10:00:00Z', sta: '2024-08-01T12:00:00Z' },
  })
  @Prop({ type: FlightSchedule, required: true })
  schedule: FlightSchedule;

  @ApiProperty({ example: 'LPPD' })
  @Prop({ required: true, minlength: 4, maxlength: 4 })
  departure: string;

  @ApiProperty({ example: 'LPLA' })
  @Prop({ required: true, minlength: 4, maxlength: 4 })
  destination: string;

  // TODO: make required: true when user authentication is implemented
  @Prop({ required: false, type: mongoose.Types.ObjectId, ref: 'User', index: true })
  user: mongoose.Types.ObjectId;

  // these 2 fields are not a requirement for the assessment, but useful for tracking
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const FlightSchema = SchemaFactory.createForClass(Flight);

FlightSchema.pre<Flight>('save', function (next) {
  this.updatedAt = new Date();
  next();
});
