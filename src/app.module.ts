import {  Module,  } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory,  Transport } from '@nestjs/microservices';

import { PrismaService } from 'src/database/prisma.service';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RqRsFactoryService } from './services/rq-rs-factory.service';
import { RQ_RS_FACTORY_SERVICE } from './interfaces';

/* -------------------------------------------- */

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }), 
  ],
  controllers: [AppController],
  providers: [AppService, 
    {
      provide: 'RABIT_SERVICE_TRANSPORT',
      useFactory: (configService: ConfigService) => {
        const queue_input = configService.get<string>('QUEUE_INPUT')
        const host = configService.get<string>('TRANSPORT_HOST')
        const port = parseInt(configService.get<string>('TRANSPORT_PORT'))

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${host}:${port}`],
            queue: `${queue_input}`,
            queueOptions: {
              durable:  true, //persistent
            },
          },
        });       
      },
      inject: [ConfigService],
    },
    {
      provide: 'COMPANY_DEPENDENCIES_TRANSPORT',
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('COMPANY_DEPENDENCIES_HOST')
        const port = parseInt(configService.get<string>('COMPANY_DEPENDENCIES_PORT'))

        return ClientProxyFactory.create({
          transport: Transport.REDIS,
          options: {
            host: host,
            port: port,
          },
        });       
      },
      inject: [ConfigService],
    },
    PrismaService,
    {
      provide: 'RABBIT_SERVICE_ZONES',
      useFactory: (configService: ConfigService) => {
        const queue_input = configService.get<string>('ZONES_QUEUE_INPUT')
        const host = configService.get<string>('ZONES_HOST')
        const port = parseInt(configService.get<string>('ZONES_PORT'))

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${host}:${port}`],
            queue: `${queue_input}`,
            queueOptions: {
              durable:  true, 
            },
          },
        });       
      },
      inject: [ConfigService],
    },
    {
      provide: 'PRODUCT_TRANSPORT',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'product',
            protoPath: join(__dirname, './grpc-product/product.proto'),
            url: configService.get('URL_PRODUCTS'),
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'ORDER_SERVICE_TRANSPORT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('ORDER_HOST'),
            port: configService.get('ORDER_PORT'),
          },
        }),
    },
    {
      useClass: RqRsFactoryService, // You can switch useClass to different implementation
      provide: RQ_RS_FACTORY_SERVICE,
    },
  ],
})

/* -------------------------------------------- */

export class AppModule {}

