import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { Flight } from './schemas/flight.schema';

@Injectable()
export class FlightsService {
  constructor(@InjectModel(Flight.name) private flightModel: Model<Flight>) {}

  async create(createFlightDto: CreateFlightDto): Promise<Flight> {
    const createdFlight = new this.flightModel(createFlightDto);
    return createdFlight.save();
  }

  async findAll(): Promise<Flight[]> {
    // TODO: filter flights by authenticated user when auth is implemented
    const flights = await this.flightModel.find().lean().exec();
    return flights;
  }

  async findOne(id: string): Promise<Flight | null> {
    return this.flightModel.findById(id).lean().exec();
  }

  async update(id: string, updateFlightDto: UpdateFlightDto): Promise<Flight | null> {
    const updatedFlight = await this.flightModel
      .findByIdAndUpdate(id, updateFlightDto, {
        new: true,
        lean: true,
      })
      .exec();
    return updatedFlight;
  }

  async remove(id: string): Promise<Flight | null> {
    const deletedFlight = await this.flightModel.findByIdAndDelete(id).lean().exec();
    return deletedFlight;
  }
}
