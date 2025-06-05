import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { setupAppGlobals } from '../src/common/utilities/app-setup.util';
import { AppTestModule } from './app-tests.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppTestModule],
    }).compile();

    app = module.createNestApplication();

    setupAppGlobals(app);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register and login user', async () => {
    const username = `testuser${Date.now() % 1000}`;
    const password = 'mY_cOmPlEx_P455';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, password })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/auth')
      .send({ username, password })
      .expect(200);

    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe('string');
  });

  it('should fail to register user with a weak password', async () => {
    const weakPassword = 'weakPass123';
    const username = `weakpassuser${Date.now() % 1000}`;

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, password: weakPassword })
      .expect(400);

    expect(res.body.message).toBeDefined();
    expect(typeof res.body.message).toBe('string');
    expect(res.body.message).toBe('Invalid payload');
  });

  it('should fail to register user with special characters in username', async () => {
    const invalidUsername = 'invalid$user!';
    const password = 'Val1d_Pass!';

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: invalidUsername, password })
      .expect(400);

    expect(res.body.message).toBeDefined();
    expect(typeof res.body.message).toBe('string');
    expect(res.body.message).toBe('Invalid payload');
  });
});
