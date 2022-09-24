import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

/* ------------------------------- */

async function bootstrap() {

  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const host = configService.get<string>('ROUTE_HOST');
  const port = configService.get<string>('ROUTE_PORT');
  
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.NATS,
    options: {
      servers: [`nats://${host}:${port}`],
    }};

  const app = await NestFactory.createMicroservice(
    AppModule,
    microserviceOptions
  );

  await app.listen();
}

/* ------------------------------- */

bootstrap();

