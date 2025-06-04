import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { Flight } from '../src/flights/schemas/flight.schema';

describe('FlightsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, MongooseModule.forRoot('mongodb://localhost/nest-flights-e2e')],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new AllExceptionsFilter());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let createdFlightId: string;

  const sampleFlight: Partial<Flight> = {
    aircraft: 'CSTRC',
    flightNumber: `AVIO${(Date.now() % 1000).toString().padStart(3, '0')}`,
    schedule: {
      std: new Date('2024-09-30T22:00:00.000Z'),
      sta: new Date('2024-09-30T23:00:00.000Z'),
    },
    departure: 'LPPD',
    destination: 'LPLA',
  };

  it('should create a flight (POST /flights)', async () => {
    const res = await request(app.getHttpServer()).post('/flights').send(sampleFlight).expect(201);

    expect(res.body).toMatchObject({
      id: expect.any(String),
      aircraft: sampleFlight.aircraft,
      flightNumber: sampleFlight.flightNumber,
      departure: sampleFlight.departure,
      destination: sampleFlight.destination,
    });

    createdFlightId = res.body.id;
  });

  it('should get all flights (GET /flights)', async () => {
    const res = await request(app.getHttpServer()).get('/flights').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).not.toHaveProperty('_id');
  });

  it('should get a specific flight (GET /flights/:flightId)', async () => {
    const res = await request(app.getHttpServer()).get(`/flights/${createdFlightId}`).expect(200);

    expect(res.body.id).toBe(createdFlightId);
    expect(res.body.flightNumber).toBe(sampleFlight.flightNumber);
  });

  it('should update a flight (PATCH /flights/:flightId)', async () => {
    const updated = {
      ...sampleFlight,
      destination: 'LFPG',
    };

    const res = await request(app.getHttpServer())
      .patch(`/flights/${createdFlightId}`)
      .send(updated)
      .expect(200);

    expect(res.body.destination).toBe('LFPG');
    expect(res.body.id).toBe(createdFlightId);
  });

  it('should delete a flight (DELETE /flights/:flightId)', async () => {
    await request(app.getHttpServer()).delete(`/flights/${createdFlightId}`).expect(204);
    await request(app.getHttpServer()).get(`/flights/${createdFlightId}`).expect(404);
  });

  it('should return 404 for non-existent flight', async () => {
    const fakeId = '507f1f77bcf86cd799439011';

    await request(app.getHttpServer()).get(`/flights/${fakeId}`).expect(404);
    await request(app.getHttpServer()).patch(`/flights/${fakeId}`).send(sampleFlight).expect(404);
    await request(app.getHttpServer()).delete(`/flights/${fakeId}`).expect(404);
  });
});
