import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

import { ValidatedJwtData } from '../../src/auth/jwt.strategy';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { FlightsService } from './flights.service';
import { Flight, FlightSchema } from './schemas/flight.schema';

describe('FlightsService', () => {
  let service: FlightsService;
  let flightModel: Model<Flight>;
  const mockUserData: ValidatedJwtData = {
    userId: new ObjectId().toString(),
    username: 'testuser',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/test'),
        MongooseModule.forFeature([{ name: Flight.name, schema: FlightSchema }]),
      ],
      providers: [FlightsService],
    }).compile();

    service = module.get<FlightsService>(FlightsService);
    flightModel = module.get<Model<Flight>>('FlightModel');
  });

  afterEach(async () => {
    await flightModel.deleteMany({});
  });

  afterAll(async () => {
    await flightModel.db.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new flight', async () => {
      const dto: CreateFlightDto = {
        aircraft: 'A320',
        flightNumber: 'FL001',
        schedule: {
          std: '2025-01-01T10:00:00.000Z',
          sta: '2025-01-01T12:00:00.000Z',
        },
        departure: 'EDDF',
        destination: 'EHAM',
      };

      const flight = await service.create(dto, mockUserData.userId);

      expect(flight).toBeDefined();
      expect(flight.flightNumber).toBe('FL001');
      expect(flight.aircraft).toBe('A320');
    });
  });

  describe('findAll', () => {
    it('should return all flights', async () => {
      const now = new Date();
      await flightModel.insertMany([
        {
          aircraft: 'B737',
          flightNumber: 'FL002',
          schedule: { std: now, sta: now },
          departure: 'EGLL',
          user: mockUserData.userId,
          destination: 'LFPG',
        },
        {
          aircraft: 'A330',
          flightNumber: 'FL003',
          schedule: { std: now, sta: now },
          departure: 'LIRF',
          user: mockUserData.userId,
          destination: 'LEMD',
        },
      ]);

      const flights = await service.findAll(mockUserData.userId);

      expect(flights).toHaveLength(2);
      expect(flights.map((f) => f.flightNumber)).toEqual(
        expect.arrayContaining(['FL002', 'FL003']),
      );
    });
  });

  describe('findOne', () => {
    it('should return the correct flight', async () => {
      const created = await flightModel.create({
        aircraft: 'B787',
        flightNumber: 'FL004',
        schedule: {
          std: new Date('2025-02-01T08:00:00.000Z'),
          sta: new Date('2025-02-01T11:00:00.000Z'),
        },
        user: mockUserData.userId,
        departure: 'RJTT',
        destination: 'KLAX',
      });

      const result = await service.findOne(created._id.toString());

      expect(result).toBeDefined();
      expect(result?.flightNumber).toBe('FL004');
    });

    it('should throw an error if flight does not exist', async () => {
      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow('Flight not found');
    });
  });

  describe('update', () => {
    it('should update an existing flight and return the updated document', async () => {
      const created = await flightModel.create({
        aircraft: 'A350',
        flightNumber: 'FL005',
        schedule: {
          std: new Date('2025-03-01T10:00:00.000Z'),
          sta: new Date('2025-03-01T14:00:00.000Z'),
        },
        user: mockUserData.userId,
        departure: 'KJFK',
        destination: 'EGLL',
      });

      const updateDto: UpdateFlightDto = {
        aircraft: 'A380',
        flightNumber: 'FL005',
        schedule: {
          std: '2025-03-01T11:00:00.000Z',
          sta: '2025-03-01T15:30:00.000Z',
        },
        departure: 'KJFK',
        destination: 'EDDF',
      };

      const result = await service.update(created._id.toString(), updateDto);

      expect(result).toBeDefined();
      if (!result) throw new Error('Flight not found');

      expect(result.aircraft).toBe('A380');
      expect(result.destination).toBe('EDDF');
      expect(new Date(result.schedule.sta)).toEqual(new Date('2025-03-01T15:30:00.000Z'));
    });

    it('should throw an error if the flight does not exist', async () => {
      const updateDto: UpdateFlightDto = {
        aircraft: 'B777',
        flightNumber: 'FL999',
        schedule: {
          std: new Date().toISOString(),
          sta: new Date().toISOString(),
        },
        departure: 'ZBAA',
        destination: 'WSSS',
      };

      await expect(service.update('507f1f77bcf86cd799439011', updateDto)).rejects.toThrow(
        'Flight not found',
      );
    });
  });

  describe('remove', () => {
    it('should delete an existing flight and return the deleted document', async () => {
      const created = await flightModel.create({
        aircraft: 'A321',
        flightNumber: 'FL006',
        schedule: {
          std: new Date('2025-04-01T09:00:00.000Z'),
          sta: new Date('2025-04-01T11:30:00.000Z'),
        },
        user: mockUserData.userId,
        departure: 'KSFO',
        destination: 'KMIA',
      });

      const deleted = await service.remove(created._id.toString());

      expect(deleted).toBeDefined();
      expect(deleted?._id.toString()).toBe(created._id.toString());

      const found = await flightModel.findById(created._id);
      expect(found).toBeNull();
    });

    it('should throw an exception when trying to delete a non-existent flight', async () => {
      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow('Flight not found');
    });
  });
});
