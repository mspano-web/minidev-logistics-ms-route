import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { PrismaService } from 'src/database/prisma.service';
import { firstValueFrom } from 'rxjs';
import {
  RqGetCompanyDependenciesByZoneDto,
  RqGetOrderDto,
  RqGetOrdersByDateZoneDto,
  RqGetTransporByZoneDto,
  RqLoadedOrder,
  RsCashDepositRouteDto,
  RsGetOrderDto,
  RsGetOrdersByDateZoneDto,
  RsGetRouteAmountDto,
  RsGetRouteOrdersDetailsDto,
  RsGetTransportByZoneDto,
  RsGetZonesDto,
  RsLoadedOrderDto,
} from './dto';
import { RoutesHeaderEntity } from './entity/route-entity';
import { ProductServices, RqFindProduct } from './grpc-product/product.pb';
import { RouteOrderDetails } from './types/routeOrderDetails.business';
import { CashDepositType } from '@prisma/client';
import { IRqRsFactory, RQ_RS_FACTORY_SERVICE } from './interfaces';
import { RsGetCompanyDependencyByZoneDto } from './dto/rs-get-company-dependency-by-zone.dto';
import { RoutesDetailsEntity } from './dto/rs-get-route-for-map.dto';

/* ------------------------------ */

@Injectable()
export class AppService {
  private srv: ProductServices;

  constructor(
    @Inject('RABBIT_SERVICE_ZONES') private client_zones: ClientProxy,
    @Inject('COMPANY_DEPENDENCIES_TRANSPORT')
    private company_dependency_transport: ClientProxy,
    @Inject('ORDER_SERVICE_TRANSPORT')
    private readonly orderClient: ClientProxy,
    @Inject('RABIT_SERVICE_TRANSPORT') private client_transport: ClientProxy,
    private prisma: PrismaService,
    @Inject('PRODUCT_TRANSPORT') private client_product: ClientGrpc,
    @Inject(RQ_RS_FACTORY_SERVICE)
    private readonly rqRsFactoryService: IRqRsFactory,
  ) {}

  /* ----------------- */

  onModuleInit() {
    this.srv =
      this.client_product.getService<ProductServices>('ProductServices');
  }

  /* ----------------- */

  async onModuleDestroy(): Promise<void> {
    await this.orderClient.close();
  }

  /* ----------------- */

  async generateRoute(date_generate: string) {
    const routesToSave: RoutesHeaderEntity[] = [];
    try {
      const resZones: RsGetZonesDto = await firstValueFrom(
        this.client_zones.send({ cmd: 'ms-get-zones' }, ''),
      );
      if (resZones) {
        let posZones = 0;
        for (; posZones < resZones.rsGetZonesDataDto.length; posZones++) {
          const rqCD: RqGetCompanyDependenciesByZoneDto = {
            id: resZones.rsGetZonesDataDto[posZones].id,
          };
          const resCD: RsGetCompanyDependencyByZoneDto = await firstValueFrom(
            this.company_dependency_transport.send(
              { cmd: 'ms-get-company-dependency-by-zone' },
              rqCD,
            ),
          );

          // Example Bad practice: Number 2 hardcode!1
          if (resCD && resCD.rsGetCompanyDependencyDataByZoneDto.length === 2) {
            // Only 1 origen & destiny by zone

            const rqGetOrdersByDateZoneDto: RqGetOrdersByDateZoneDto = {
              date_delivery: date_generate,
              zone_id: rqCD.id,
            };

            const resOrders: RsGetOrdersByDateZoneDto = await firstValueFrom(
              this.orderClient.send(
                'ms-orders-get-by-date-zone',
                rqGetOrdersByDateZoneDto,
              ),
            );

            if (
              resOrders &&
              resOrders.rsGenericHeaderDto.statusCode === HttpStatus.OK &&
              resOrders.rqGetOrdersDto.length
            ) {
              const rqGetTransporByZoneDto: RqGetTransporByZoneDto = {
                zone_id: rqCD.id,
              };

              const resTransports: RsGetTransportByZoneDto =
                await firstValueFrom(
                  this.client_transport.send<RsGetTransportByZoneDto>(
                    'ms-get-transport-by-zone',
                    rqGetTransporByZoneDto,
                  ),
                );

              if (
                resTransports &&
                resTransports.rsGenericHeaderDto.statusCode === HttpStatus.OK &&
                resTransports.rsGetTransportByZoneDataDto.length > 0
              ) {
                const origin =
                  await resCD.rsGetCompanyDependencyDataByZoneDto.find(
                    (element) => element.dependencyType === 'ORIGIN',
                  );
                const destination =
                  await resCD.rsGetCompanyDependencyDataByZoneDto.find(
                    (element) => element.dependencyType === 'DESTINY',
                  );
                let posTransport = 0;
                let numTransport = 1;
                let pendingSave = true;

                const routesHeaderEntity =
                  this.rqRsFactoryService.createRoutesHeaderEntity(
                    resTransports.rsGetTransportByZoneDataDto[posTransport],
                    origin.id,
                    destination.id,
                    rqCD.id,
                    [],
                  );

                resOrders.rqGetOrdersDto.forEach(async (orderElement) => {
                  // Example Bad practice: Number 5 hardcode!1
                  if (numTransport === 5) {
                    routesToSave.push(
                      JSON.parse(JSON.stringify(routesHeaderEntity)),
                    );
                    numTransport = 1;

                    routesHeaderEntity.routesDetails = [];
                    if (
                      posTransport + 1 >=
                      resTransports.rsGetTransportByZoneDataDto.length
                    ) {
                      throw new Error('Need more Transports!');
                    } else {
                      posTransport++;
                      routesHeaderEntity.transport_id =
                        resTransports.rsGetTransportByZoneDataDto[posTransport];
                    }
                  }
                  const routesDetailsEntry =
                    this.rqRsFactoryService.createRoutesDetailsEntity(
                      orderElement.id,
                    );
                  routesHeaderEntity.routesDetails.push(routesDetailsEntry);
                  numTransport++;
                  pendingSave = true;
                });

                if (pendingSave) {
                  routesToSave.push(
                    JSON.parse(JSON.stringify(routesHeaderEntity)),
                  );
                }
              } else {
                console.log(
                  `[generate-route][service] - Fail! Without transports: ${rqCD.id}`,
                );
              }
            } else {
              console.log(
                `[generate-route][service] - Fail! Without orders: ${rqCD.id}`,
              );
            }
          } else {
            console.log(
              `[generate-route][service] - Bad Configuration Company Dependency zone_id: ${rqCD.id}`,
            );
          }
        }

        routesToSave.forEach(async (routeElement) => {
          await this.prisma.routesHeader.create({
            data: {
              transport_id: routeElement.transport_id,
              origin_id: routeElement.origin_id,
              destination_id: routeElement.destination_id,
              zone_id: routeElement.zone_id,
              time_started: null,
              time_end: null,
              routesDetails: {
                create: [...routeElement.routesDetails],
              },
            },
          });
        });
      } else {
        console.log(
          `[generate-route][service] - Fail! Without zones -  date_generate: ${date_generate}`,
        );
      }
    } catch (e) {
      console.log('[generate-route][service] - Fail! Exception: (', e, ')');
    }
  }

  /* ----------------- */

  async getRouteForMap(date_route: string, transport_id: string) {
    let rsGetRouteForMapDto = null;

    try {
      const res = await this.prisma.routesHeader.findFirst({
        where: {
          AND: [
            { created_date: new Date(date_route) },
            { transport_id: Number(transport_id) },
          ],
        },
        include: {
          routesDetails: true,
        },
      });

      if (res) {
        rsGetRouteForMapDto = this.rqRsFactoryService.createRsRouteForMap(
          HttpStatus.OK,
          '',
          {
            transport_id: res.transport_id,
            origin_id: res.origin_id,
            destination_id: res.destination_id,
            zone_id: res.zone_id,
            time_started: res.time_started,
            time_end: res.time_end,
            routesDetails: [],
          },
        );

        let pos = 0;
        for (; pos < res.routesDetails.length; pos++) {
          const routesDetailsEntity: RoutesDetailsEntity =
            this.rqRsFactoryService.createRoutesDetailsEntity(
              res.routesDetails[pos].order_id,
            );
          rsGetRouteForMapDto.rsRouteDetailDto.routesDetails.push(
            routesDetailsEntity,
          );
        }
      } else {
        rsGetRouteForMapDto = this.rqRsFactoryService.createRsRouteForMap(
          HttpStatus.NOT_FOUND,
          'Route is Em´pty',
          null,
        );
      }
    } catch (e) {
      rsGetRouteForMapDto = this.rqRsFactoryService.createRsRouteForMap(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Get Route For Map Fail!',
        null,
      );
    }
    console.log('[get-route-for-map][service] - (', rsGetRouteForMapDto, ')');

    return rsGetRouteForMapDto;
  }

  /* ------------------- */

  async getRouteOrderDetails(
    route_id: string,
  ): Promise<RsGetRouteOrdersDetailsDto> {
    const routeOrdersDetails: RouteOrderDetails[] = [];
    let rsGetRouteOrdersDetailsDto = null;

    try {
      const route = await this.prisma.routesHeader.findUnique({
        where: {
          id: Number(route_id),
        },
        include: {
          routesDetails: true,
        },
      });

      if (route) {
        let pos = 0;
        let OK = true;
        for (; OK && pos < route.routesDetails.length; pos++) {
          const rqGetOrderDto: RqGetOrderDto = {
            id: route.routesDetails[pos].order_id,
          };

          const resOrder: RsGetOrderDto = await firstValueFrom(
            this.orderClient.send('ms-order-get', rqGetOrderDto),
          );

          if (
            resOrder &&
            resOrder.rsGenericHeaderDto.statusCode === HttpStatus.OK
          ) {
            let posOrder = 0;
            for (
              ;
              posOrder < resOrder.rsGetOrderHeaderDto.rsGetOrderDetails.length;
              posOrder++
            ) {
              const found = routeOrdersDetails.find(
                (element) =>
                  element.product_id ===
                  resOrder.rsGetOrderHeaderDto.rsGetOrderDetails[posOrder]
                    .product_id,
              );
              if (!found) {
                const routeOrderDetails: RouteOrderDetails =
                  this.rqRsFactoryService.createRouteOrderDetails(
                    resOrder.rsGetOrderHeaderDto.rsGetOrderDetails[posOrder]
                      .product_id,
                    'UNDEFINED DESCRIPTION', //default
                    resOrder.rsGetOrderHeaderDto.rsGetOrderDetails[posOrder]
                      .quantity,
                  );
                routeOrdersDetails.push(routeOrderDetails);
              } else {
                found.quantity +=
                  resOrder.rsGetOrderHeaderDto.rsGetOrderDetails[
                    posOrder
                  ].quantity;
              }
            }
          } else {
            rsGetRouteOrdersDetailsDto =
              this.rqRsFactoryService.createRsGetRouteOrdersDetailsDto(
                HttpStatus.INTERNAL_SERVER_ERROR,
                `Get Route Order Details Fail! - Get Order ${rqGetOrderDto}`,
                null,
              );
            OK = false;
          }
        }
        for (
          let posRes = 0;
          OK && posRes < routeOrdersDetails.length;
          posRes++
        ) {
          const rqFindProduct: RqFindProduct = {
            id: routeOrdersDetails[posRes].product_id,
          };
          const resProduct = await firstValueFrom(
            this.srv.getProduct(rqFindProduct),
          );
          if (resProduct) {
            if (resProduct.status === HttpStatus.OK) {
              routeOrdersDetails[posRes].description =
                resProduct.data.description;
            } // else default previous
          } else {
            rsGetRouteOrdersDetailsDto =
              this.rqRsFactoryService.createRsGetRouteOrdersDetailsDto(
                HttpStatus.INTERNAL_SERVER_ERROR,
                `Get Route Order Details Fail! - Get Product ${rqFindProduct}`,
                null,
              );
            OK = false;
          }
        }

        if (rsGetRouteOrdersDetailsDto === null) {
          rsGetRouteOrdersDetailsDto =
            this.rqRsFactoryService.createRsGetRouteOrdersDetailsDto(
              HttpStatus.OK,
              '',
              routeOrdersDetails,
            );
        }
      }
    } catch (e) {
      rsGetRouteOrdersDetailsDto =
        this.rqRsFactoryService.createRsGetRouteOrdersDetailsDto(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Get Route Order Details Fail!',
          null,
        );
    }
    console.log(
      '[get-route-orders-details][service] - (',
      rsGetRouteOrdersDetailsDto,
      ')',
    );

    return rsGetRouteOrdersDetailsDto;
  }

  /* ------------------- */

  async getRouteAmount(route_id: string): Promise<RsGetRouteAmountDto> {
    const routeOrdersDetails: RouteOrderDetails[] = [];
    let amount = 0;
    let rsGetRouteAmountDto = null;

    try {
      const route = await this.prisma.routesHeader.findUnique({
        where: {
          id: Number(route_id),
        },
        include: {
          routesDetails: true,
        },
      });
      if (route) {
        let pos = 0;
        let OK = true;
        for (; OK && pos < route.routesDetails.length; pos++) {
          const rqGetOrderDto: RqGetOrderDto = {
            id: route.routesDetails[pos].order_id,
          };

          const resOrder: RsGetOrderDto = await firstValueFrom(
            this.orderClient.send('ms-order-get', rqGetOrderDto),
          );

          if (
            resOrder &&
            resOrder.rsGenericHeaderDto.statusCode === HttpStatus.OK
          ) {
            let posOrder = 0;
            for (
              ;
              posOrder < resOrder.rsGetOrderHeaderDto.rsGetOrderDetails.length;
              posOrder++
            ) {
              const found = routeOrdersDetails.find(
                (element) =>
                  element.product_id ===
                  resOrder.rsGetOrderHeaderDto.rsGetOrderDetails[posOrder]
                    .product_id,
              );

              if (!found) {
                const routeOrderDetails: RouteOrderDetails =
                  this.rqRsFactoryService.createRouteOrderDetails(
                    resOrder.rsGetOrderHeaderDto.rsGetOrderDetails[posOrder]
                      .product_id,
                    'UNDEFINED DESCRIPTION', //default
                    resOrder.rsGetOrderHeaderDto.rsGetOrderDetails[posOrder]
                      .quantity,
                  );
                routeOrdersDetails.push(routeOrderDetails);
              } else {
                found.quantity +=
                  resOrder.rsGetOrderHeaderDto.rsGetOrderDetails[
                    posOrder
                  ].quantity;
              }
            }
          } else {
            rsGetRouteAmountDto =
              this.rqRsFactoryService.createRsGetRouteAmountDto(
                HttpStatus.INTERNAL_SERVER_ERROR,
                `Get Route Amount Fail! - Get Order ${rqGetOrderDto}`,
                null,
              );
            OK = false;
          }
        }
        for (
          let posRes = 0;
          OK && posRes < routeOrdersDetails.length;
          posRes++
        ) {
          const rqFindProduct: RqFindProduct = {
            id: routeOrdersDetails[posRes].product_id,
          };
          const resProduct = await firstValueFrom(
            this.srv.getProduct(rqFindProduct),
          );
          if (resProduct) {
            if (resProduct.status === HttpStatus.OK) {
              amount +=
                routeOrdersDetails[posRes].quantity * resProduct.data.price;
            } else {
              rsGetRouteAmountDto =
                this.rqRsFactoryService.createRsGetRouteAmountDto(
                  HttpStatus.INTERNAL_SERVER_ERROR,
                  `Get Route Amount Fail! - Get Product ${rqFindProduct}`,
                  null,
                );
              OK = false;
            }
          } else {
            rsGetRouteAmountDto =
              this.rqRsFactoryService.createRsGetRouteAmountDto(
                HttpStatus.INTERNAL_SERVER_ERROR,
                `Get Route Amount Fail! - Get Product ${rqFindProduct}`,
                null,
              );
            OK = false;
          }
        }
        if (OK) {
          rsGetRouteAmountDto =
            this.rqRsFactoryService.createRsGetRouteAmountDto(
              HttpStatus.OK,
              '',
              amount,
            );
        }
      }
    } catch (e) {
      rsGetRouteAmountDto = this.rqRsFactoryService.createRsGetRouteAmountDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Get Route Amount Fail!',
        null,
      );
    }
    console.log('[get-route-amount][service] - (', rsGetRouteAmountDto, ')');

    return rsGetRouteAmountDto;
  }

  /* ------------------- */

  async cashDeposited(id: string): Promise<RsCashDepositRouteDto> {
    let rsCashDepositRouteDto = null;

    try {
      const res = await this.prisma.routesHeader.update({
        where: { id: Number(id) },
        data: {
          cashDeposited: CashDepositType.DEPOSITED,
          time_end: new Date(),
        },
      });
      if (res) {
        rsCashDepositRouteDto =
          this.rqRsFactoryService.createRsCashDepositRouteDto(
            HttpStatus.OK,
            '',
          );
      } else {
        rsCashDepositRouteDto =
          this.rqRsFactoryService.createRsCashDepositRouteDto(
            HttpStatus.NOT_FOUND,
            'Cash Deposit Fail! Not Found Route',
          );
      }
    } catch (e) {
      rsCashDepositRouteDto =
        this.rqRsFactoryService.createRsCashDepositRouteDto(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Cash Deposit Fail!',
        );
    }
    console.log('[cash-deposited][service] - (', rsCashDepositRouteDto, ')');

    return rsCashDepositRouteDto;
  }

  /* ------------------- */

  async loadedTransport(route_id: string): Promise<RsLoadedOrderDto> {
    let rsLoadedOrderDto = null;

    try {
      const resRoute = await this.prisma.routesHeader.update({
        where: { id: Number(route_id) },
        data: {
          time_started: new Date(),
        },
      });
      if (resRoute) {
        const resFindRoute = await this.prisma.routesHeader.findUnique({
          where: {
            id: Number(route_id),
          },
          include: {
            routesDetails: true,
          },
        });

        if (resFindRoute) {
          let pos = 0;
          for (; pos < resFindRoute.routesDetails.length; pos++) {
            const rqLoadedOrder: RqLoadedOrder = {
              key: resFindRoute.routesDetails[pos].order_id.toString(),
            };

            const resOrder: RsLoadedOrderDto = await firstValueFrom(
              this.orderClient.send('ms-order-loaded', rqLoadedOrder),
            );

            if (resOrder) {
              if (resOrder.rsGenericHeaderDto.statusCode === HttpStatus.OK) {
                rsLoadedOrderDto =
                  this.rqRsFactoryService.createRsLoadedOrderDto(
                    HttpStatus.OK,
                    '',
                  );
              } else {
                rsLoadedOrderDto = this.rqRsFactoryService.createRsLoadedOrderDto(
                  HttpStatus.INTERNAL_SERVER_ERROR,
                  `Load Order Fail! - Find Order: ${rqLoadedOrder}`,
                );
              }
            } else {
              rsLoadedOrderDto = this.rqRsFactoryService.createRsLoadedOrderDto(
                HttpStatus.INTERNAL_SERVER_ERROR,
                `Load Order Fail! - Find Order: ${rqLoadedOrder}`,
              );
            }
          }
        }
      } else {
        rsLoadedOrderDto = this.rqRsFactoryService.createRsLoadedOrderDto(
          HttpStatus.INTERNAL_SERVER_ERROR,
          `Load Order Fail! - Update for route: ${route_id}`,
        );
      }
    } catch (e) {
      rsLoadedOrderDto = this.rqRsFactoryService.createRsLoadedOrderDto(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Load Order Fail!',
      );
    }
    console.log('[loaded-transport][service] - (', rsLoadedOrderDto, ')');

    return rsLoadedOrderDto;
  }
}

/* ------------------------------- */
