import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import request from 'supertest';

import { setupAppGlobals } from '../src/common/utilities/app-setup.util';
import { Flight } from '../src/flights/schemas/flight.schema';
import { AppTestModule } from './app-tests.module';

describe('FlightsController (e2e)', () => {
  let app: INestApplication;
  let createdFlightId: string;
  let userToken: string;

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

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppTestModule],
    }).compile();

    app = moduleRef.createNestApplication();

    setupAppGlobals(app);

    await app.init();
    const flightModel = app.get(getModelToken('Flight'));
    const userModel = app.get(getModelToken('User'));
    await flightModel.deleteMany({});
    await userModel.deleteMany({});

    const username = `flighttest${Date.now() % 1000}`;
    const password = 'Str0ngP@ssword';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, password })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/auth')
      .send({ username, password })
      .expect(200);

    sampleFlight.user = loginRes.body.userId;

    const user = `user${Date.now()}`;
    const pass = 'Str0ngP@ssword';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: user, password: pass })
      .expect(201);

    const loginA = await request(app.getHttpServer())
      .post('/auth')
      .send({ username: user, password: pass })
      .expect(200);

    userToken = loginA.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 401 if unauthenticated (POST /flights)', async () => {
    await request(app.getHttpServer()).post('/flights').send(sampleFlight).expect(401);
  });

  it('should return 401 if unauthenticated (GET /flights)', async () => {
    await request(app.getHttpServer()).get('/flights').expect(401);
  });

  it('should return 401 if unauthenticated (GET /flights/:id)', async () => {
    await request(app.getHttpServer()).get('/flights/invalidId').expect(401);
  });

  it('should return 401 if unauthenticated (PATCH /flights/:id)', async () => {
    await request(app.getHttpServer())
      .patch('/flights/invalidId')
      .send({ destination: 'LFPG' })
      .expect(401);
  });

  it('should return 401 if unauthenticated (DELETE /flights/:id)', async () => {
    await request(app.getHttpServer()).delete('/flights/invalidId').expect(401);
  });

  it('should return 401 for requests with invalid token', async () => {
    const invalidToken = 'Bearer invalid.token.here';

    await request(app.getHttpServer())
      .get('/flights')
      .set('Authorization', invalidToken)
      .expect(401);

    await request(app.getHttpServer())
      .post('/flights')
      .set('Authorization', invalidToken)
      .send(sampleFlight)
      .expect(401);
  });

  it('should return 401 for requests with expired token', async () => {
    const expiredToken = jwt.sign(
      { userId: 'someuserid' },
      process.env.JWT_SECRET || 'your-secret',
      { expiresIn: '-10s' },
    );

    await request(app.getHttpServer())
      .get('/flights')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);
  });

  it('should create a flight (POST /flights)', async () => {
    const res = await request(app.getHttpServer())
      .post('/flights')
      .set('Authorization', `Bearer ${userToken}`)
      .send(sampleFlight)
      .expect(201);

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
    const res = await request(app.getHttpServer())
      .get('/flights')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).not.toHaveProperty('_id');
  });

  it('should get a specific flight (GET /flights/:flightId)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/flights/${createdFlightId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

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
      .set('Authorization', `Bearer ${userToken}`)
      .send(updated)
      .expect(200);

    expect(res.body.destination).toBe('LFPG');
    expect(res.body.id).toBe(createdFlightId);
  });

  it('should delete a flight (DELETE /flights/:flightId)', async () => {
    await request(app.getHttpServer())
      .delete(`/flights/${createdFlightId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/flights/${createdFlightId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(404);
  });

  it('should return 404 for non-existent flight', async () => {
    const fakeId = new Types.ObjectId().toHexString();

    await request(app.getHttpServer())
      .get(`/flights/${fakeId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(404);

    await request(app.getHttpServer())
      .patch(`/flights/${fakeId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(sampleFlight)
      .expect(404);

    await request(app.getHttpServer())
      .delete(`/flights/${fakeId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(404);
  });
});
