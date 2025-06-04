import { Flight } from '../schemas/flight.schema';

export class MappedFlight implements Omit<Partial<Flight>, '_id'> {
  id: string;
}

export function mapFlight(flight: Flight): MappedFlight {
  const obj = flight.toObject ? flight.toObject() : flight;
  const { _id, ...rest } = obj;
  return { id: _id.toString(), ...rest };
}
