import { ObjectId } from 'mongodb';

import { Flight } from '../schemas/flight.schema';
import { mapFlight } from './flightResponse.util';

describe('mapFlight', () => {
  it('should map _id to id and omit _id from the result (plain object)', () => {
    const flight = {
      _id: new ObjectId('60b8d295f1d2ee1a88e4d123'),
      flightNumber: 'AB123',
      aircraft: 'A320',
      departure: 'LPPD',
      destination: 'LPLA',
      schedule: {
        std: new Date('2024-09-30T22:00:00Z'),
        sta: new Date('2024-09-30T23:00:00Z'),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Partial<Flight>;

    const result = mapFlight(flight as Flight);

    expect(result).toEqual(
      expect.objectContaining({
        id: '60b8d295f1d2ee1a88e4d123',
        flightNumber: 'AB123',
        aircraft: 'A320',
        departure: 'LPPD',
        destination: 'LPLA',
      }),
    );

    expect(result).not.toHaveProperty('_id');
  });

  it('should call toObject if flight is a Mongoose document', () => {
    const mockId = new ObjectId();
    const mockToObject = jest.fn().mockReturnValue({
      _id: mockId,
      flightNumber: 'CD456',
      departure: 'LHR',
      destination: 'JFK',
    });

    const flight = {
      toObject: mockToObject,
    } as unknown as Flight;

    const result = mapFlight(flight);

    expect(mockToObject).toHaveBeenCalled();
    expect(result.id).toBe(mockId.toString());
    expect(result).toMatchObject({
      id: mockId.toString(),
      flightNumber: 'CD456',
      departure: 'LHR',
      destination: 'JFK',
    });
  });
});
