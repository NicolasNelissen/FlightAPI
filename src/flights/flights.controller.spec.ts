import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';

import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { Flight } from './schemas/flight.schema';
import { mapFlight } from './utilities/flightResponse.util';

describe('FlightsController', () => {
  let controller: FlightsController;
  let service: FlightsService;

  const mockFlightsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightsController],
      providers: [
        {
          provide: FlightsService,
          useValue: mockFlightsService,
        },
      ],
    }).compile();

    controller = module.get<FlightsController>(FlightsController);
    service = module.get<FlightsService>(FlightsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the flight', async () => {
      const dto: CreateFlightDto = {
        aircraft: 'A320',
        flightNumber: 'AB123',
        schedule: {
          std: '2024-09-30T22:00:00.000Z',
          sta: '2024-09-30T23:00:00.000Z',
        },
        departure: 'LPPD',
        destination: 'LPLA',
      };

      const mockedObjectId = new ObjectId();
      const expectedResult: Partial<Flight> = {
        _id: mockedObjectId,
        aircraft: 'A320',
        flightNumber: 'AB123',
        schedule: {
          std: new Date('2024-09-30T22:00:00.000Z'),
          sta: new Date('2024-09-30T23:00:00.000Z'),
        },
        departure: 'LPPD',
        destination: 'LPLA',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFlightsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(result).toEqual(
        expect.objectContaining({
          aircraft: 'A320',
          flightNumber: 'AB123',
          departure: 'LPPD',
          destination: 'LPLA',
          schedule: expect.objectContaining({
            std: new Date('2024-09-30T22:00:00.000Z'),
            sta: new Date('2024-09-30T23:00:00.000Z'),
          }),
        }),
      );

      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should throw if service.create throws', async () => {
      const dto: CreateFlightDto = {
        aircraft: 'A320',
        flightNumber: 'FAIL',
        schedule: {
          std: '2024-09-30T22:00:00.000Z',
          sta: '2024-09-30T23:00:00.000Z',
        },
        departure: 'LPPD',
        destination: 'LPLA',
      };

      mockFlightsService.create.mockRejectedValue(new Error('Create failed'));

      await expect(controller.create(dto)).rejects.toThrow('Create failed');
    });

    it('should call service.create and return the flight with mapped id', async () => {
      const dto: CreateFlightDto = {
        aircraft: 'A320',
        flightNumber: 'AB123',
        schedule: {
          std: '2024-09-30T22:00:00.000Z',
          sta: '2024-09-30T23:00:00.000Z',
        },
        departure: 'LPPD',
        destination: 'LPLA',
      };

      const mockObjectId = new ObjectId();
      const expectedResult: Partial<Flight> = {
        _id: mockObjectId,
        aircraft: 'A320',
        flightNumber: 'AB123',
        schedule: {
          std: new Date('2024-09-30T22:00:00.000Z'),
          sta: new Date('2024-09-30T23:00:00.000Z'),
        },
        departure: 'LPPD',
        destination: 'LPLA',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFlightsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(result).toHaveProperty('id', expectedResult._id!.toString());
      expect(result).not.toHaveProperty('_id');

      expect(result).toEqual(
        expect.objectContaining({
          aircraft: 'A320',
          flightNumber: 'AB123',
          departure: 'LPPD',
          destination: 'LPLA',
          schedule: expect.objectContaining({
            std: new Date('2024-09-30T22:00:00.000Z'),
            sta: new Date('2024-09-30T23:00:00.000Z'),
          }),
        }),
      );

      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return flights', async () => {
      const flights: Partial<Flight>[] = [
        {
          _id: new ObjectId(),
          flightNumber: 'AB123',
          aircraft: 'A320',
          schedule: {
            std: new Date(),
            sta: new Date(),
          },
          departure: 'LPPD',
          destination: 'LPLA',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: new ObjectId(),
          flightNumber: 'CD456',
          aircraft: 'B737',
          schedule: {
            std: new Date(),
            sta: new Date(),
          },
          departure: 'LPLA',
          destination: 'LPPD',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockFlightsService.findAll.mockResolvedValue(flights);

      const result = await controller.findAll();

      expect(result).toEqual(flights.map(mapFlight));
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id and return the flight', async () => {
      const flight: Partial<Flight> = {
        _id: new ObjectId(),
        flightNumber: 'EF789',
        aircraft: 'A330',
        schedule: {
          std: new Date('2024-10-01T10:00:00.000Z'),
          sta: new Date('2024-10-01T12:00:00.000Z'),
        },
        departure: 'LPPT',
        destination: 'LIRF',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFlightsService.findOne.mockResolvedValue(flight);

      const result = await controller.findOne('123');

      expect(result).toEqual(
        expect.objectContaining({
          flightNumber: 'EF789',
          departure: 'LPPT',
          destination: 'LIRF',
          schedule: expect.objectContaining({
            std: new Date('2024-10-01T10:00:00.000Z'),
            sta: new Date('2024-10-01T12:00:00.000Z'),
          }),
        }),
      );

      expect(service.findOne).toHaveBeenCalledWith('123');
    });

    it('should return null if flight is not found', async () => {
      mockFlightsService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('non-existent-id')).rejects.toThrow('Flight not found');
    });
  });

  describe('update', () => {
    it('should call service.update with id and DTO and return updated flight', async () => {
      const dto: UpdateFlightDto = {
        aircraft: 'B787',
        flightNumber: 'XY789',
        departure: 'EGLL',
        destination: 'EDDF',
        schedule: {
          std: new Date('2024-12-01T10:00:00.000Z').toISOString(),
          sta: new Date('2024-12-01T13:30:00.000Z').toISOString(),
        },
      };

      const mockObjectId = new ObjectId();
      const mockedStd = new Date(dto.schedule!.std);
      const mockedSta = new Date(dto.schedule!.sta);

      const updatedFlight: Partial<Flight> = {
        _id: mockObjectId,
        ...dto,
        schedule: {
          std: mockedStd,
          sta: mockedSta,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFlightsService.update.mockResolvedValue(updatedFlight);

      const result = await controller.update(mockObjectId.toString(), dto);

      expect(result).toEqual(
        expect.objectContaining({
          aircraft: 'B787',
          destination: 'EDDF',
          schedule: expect.objectContaining({
            std: mockedStd,
            sta: mockedSta,
          }),
        }),
      );

      expect(service.update).toHaveBeenCalledWith(mockObjectId.toHexString(), dto);
    });

    it('should return null if update does not find a flight', async () => {
      const dto: UpdateFlightDto = {
        aircraft: 'B787',
        flightNumber: 'ZZ999',
        departure: 'FAOR',
        destination: 'FACT',
        schedule: {
          std: new Date().toISOString(),
          sta: new Date().toISOString(),
        },
      };

      mockFlightsService.update.mockResolvedValue(null);

      // expect a notfound exception to be thrown
      await expect(controller.update('invalid-id', dto)).rejects.toThrow('Flight not found');

      expect(service.update).toHaveBeenCalledWith('invalid-id', dto);
    });

    it('should throw if service.update throws', async () => {
      const dto: UpdateFlightDto = {
        aircraft: 'B787',
        flightNumber: 'ZZ999',
        departure: 'FAOR',
        destination: 'FACT',
        schedule: {
          std: new Date().toISOString(),
          sta: new Date().toISOString(),
        },
      };

      mockFlightsService.update.mockRejectedValue(new Error('Update failed'));

      await expect(controller.update('invalid-id', dto)).rejects.toThrow('Update failed');
    });
  });

  describe('remove', () => {
    it('should call service.remove with id and delete the flight', async () => {
      mockFlightsService.remove.mockResolvedValue(true);

      // remove returns void, so await it without expecting a result
      await expect(controller.remove('123')).resolves.toBeUndefined();

      expect(service.remove).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException if flight to remove is not found', async () => {
      mockFlightsService.remove.mockResolvedValue(false);

      await expect(controller.remove('non-existent-id')).rejects.toThrow('Flight not found');

      expect(service.remove).toHaveBeenCalledWith('non-existent-id');
    });

    it('should throw if service.remove throws', async () => {
      mockFlightsService.remove.mockRejectedValue(new Error('Remove failed'));

      await expect(controller.remove('123')).rejects.toThrow('Remove failed');

      expect(service.remove).toHaveBeenCalledWith('123');
    });
  });
});
