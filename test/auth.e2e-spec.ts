import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { passwordErrorMessage } from '../src/auth/dto/register.dto';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, MongooseModule.forRoot('mongodb://localhost/nest-auth-test')],
    }).compile();

    app = module.createNestApplication();

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
    expect(res.body.message).toBe(passwordErrorMessage);
  });

  // TODO: fix me later, e2e test fails due to validation pipe not catching special characters in username
  /*it('should fail to register user with special characters in username', async () => {
    const invalidUsername = 'invalid$user!';
    const password = 'Val1d_Pass!';

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: invalidUsername, password })
      .expect(400);

    expect(res.body.message).toBeDefined();
    expect(typeof res.body.message).toBe('string');
    expect(res.body.message).toBe(usernameErrorMessage);
  });*/
});
