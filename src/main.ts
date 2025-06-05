import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { setupAppGlobals } from './common/utilities/app-setup.util';

/**
 * Bootstraps the NestJS application.
 *
 * - Creates the NestJS application instance using the AppModule.
 * - Applies global pipes and filters using the setupAppGlobals utility.
 * - Configures Swagger/OpenAPI documentation for the API.
 * - Starts the HTTP server on the specified port (default: 3000).
 *
 * This function is the entry point of the application and is called immediately after its definition.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupAppGlobals(app);

  const config = new DocumentBuilder()
    .setTitle('Aviobook Code Challenge')
    .setDescription('CRUD API for the AVIOBOOK assessment')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'bearerAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);

  //writeFileSync('./openapi.yaml', yaml.dump(document));
}
bootstrap();
