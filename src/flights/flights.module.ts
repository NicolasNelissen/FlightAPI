import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../../src/auth/auth.module';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { Flight, FlightSchema } from './schemas/flight.schema';

@Module({
  imports: [AuthModule, MongooseModule.forFeature([{ name: Flight.name, schema: FlightSchema }])],
  controllers: [FlightsController],
  providers: [FlightsService],
})
export class FlightsModule {}
