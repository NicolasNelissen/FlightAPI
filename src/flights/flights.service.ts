import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { Flight } from './schemas/flight.schema';

/**
 * Service for managing flight resources.
 *
 * Provides business logic and data access for creating, retrieving, updating, and deleting flights.
 * Interacts with the Flight Mongoose model to perform database operations.
 */
@Injectable()
export class FlightsService {
  constructor(@InjectModel(Flight.name) private flightModel: Model<Flight>) {}

  /**
   * Creates a new flight for the specified user.
   *
   * @param createFlightDto - The data for the new flight.
   * @param userId - The ID of the user creating the flight.
   * @returns The created Flight document.
   */
  async create(createFlightDto: CreateFlightDto, userId: string): Promise<Flight> {
    const createdFlight = new this.flightModel({ ...createFlightDto, user: userId });
    return createdFlight.save();
  }

  /**
   * Retrieves all flights for the specified user.
   *
   * @param userId - The ID of the user whose flights to retrieve.
   * @returns An array of Flight documents.
   */
  async findAll(userId: string): Promise<Flight[]> {
    const flights = await this.flightModel
      .find({
        user: userId,
      })
      .lean()
      .exec();
    return flights;
  }

  /**
   * Retrieves a specific flight by its ID.
   *
   * @param id - The ID of the flight to retrieve.
   * @returns The Flight document, or throws NotFoundException if not found.
   */
  async findOne(id: string): Promise<Flight | null> {
    const flight = await this.flightModel
      .findOne({
        _id: id,
      })
      .lean()
      .exec();

    if (!flight) {
      throw new NotFoundException('Flight not found');
    }

    return flight;
  }

  /**
   * Updates a specific flight by its ID.
   *
   * @param id - The ID of the flight to update.
   * @param updateFlightDto - The updated flight data.
   * @returns The updated Flight document, or throws NotFoundException if not found.
   */
  async update(id: string, updateFlightDto: UpdateFlightDto): Promise<Flight | null> {
    const flight = await this.flightModel
      .findOne(
        {
          _id: id,
        },
        { new: true, runValidators: true },
      )
      .lean()
      .exec();

    if (!flight) {
      throw new NotFoundException('Flight not found');
    }

    const updatedFlight = await this.flightModel
      .findOneAndUpdate(
        { _id: id },
        { ...updateFlightDto },
        { new: true, runValidators: true, lean: true },
      )
      .exec();

    return updatedFlight;
  }

  /**
   * Deletes a specific flight by its ID.
   *
   * @param id - The ID of the flight to delete.
   * @returns The deleted Flight document, or throws NotFoundException if not found.
   */
  async remove(id: string): Promise<Flight | null> {
    const flight = await this.flightModel
      .findOne({
        _id: id,
      })
      .lean()
      .exec();

    if (!flight) {
      throw new NotFoundException('Flight not found');
    }

    const deletedFlight = await this.flightModel
      .findOneAndDelete(
        {
          _id: id,
        },
        { lean: true },
      )
      .exec();

    return deletedFlight;
  }
}
