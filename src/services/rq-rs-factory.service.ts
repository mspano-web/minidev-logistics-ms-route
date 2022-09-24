import { Injectable } from '@nestjs/common';
import {
  RsCashDepositRouteDto,
  RsGetRouteAmountDto,
  RsGetRouteForMapDto,
  RsGetRouteOrdersDetailsDto,
  RsLoadedOrderDto,
  RsLoadedTransportRouteDto,
} from 'src/dto';
import { RsRouteOrderDetailDto } from 'src/dto/rs-get-orders-details-route.dto';
import { RsRouteDetailDto } from 'src/dto/rs-get-route-for-map.dto';

import {
  RoutesDetailsEntity,
  RoutesHeaderEntity,
} from 'src/entity/route-entity';
import { IRqRsFactory } from 'src/interfaces';
import { RouteOrderDetails } from 'src/types/routeOrderDetails.business';

/* ------------------------------------------------------- */

@Injectable()
export class RqRsFactoryService implements IRqRsFactory {
  createRoutesHeaderEntity(
    transport_id: number,
    origin_id: number,
    destination_id: number,
    zone_id: number,
    routesDetails: RoutesDetailsEntity[],
  ): RoutesHeaderEntity {
    return new RoutesHeaderEntity(
      transport_id,
      origin_id,
      destination_id,
      zone_id,
      routesDetails,
    );
  }

  /* ----------------- */

  createRoutesDetailsEntity(order_id: number): RoutesDetailsEntity {
    return new RoutesDetailsEntity(order_id);
  }

  /* ----------------- */

  createRsRouteForMap(
    statusCode: number,
    message: string,
    rsRouteDetailDto: RsRouteDetailDto,
  ): RsGetRouteForMapDto {
    return new RsGetRouteForMapDto({ statusCode, message }, rsRouteDetailDto);
  }

  /* ----------------- */

  createRsGetRouteOrdersDetailsDto(
    statusCode: number,
    message: string,
    rsRouteOrderDetailDto: RsRouteOrderDetailDto[],
  ): RsGetRouteOrdersDetailsDto {
    return new RsGetRouteOrdersDetailsDto(
      { statusCode, message },
      rsRouteOrderDetailDto,
    );
  }

  /* ----------------- */

  createRouteOrderDetails(
    product_id: string,
    description: string,
    quantity: number,
  ): RouteOrderDetails {
    return new RouteOrderDetails(product_id, description, quantity);
  }

  /* ----------------- */

  createRsGetRouteAmountDto(
    statusCode: number,
    message: string,
    amount: number,
  ): RsGetRouteAmountDto {
    return new RsGetRouteAmountDto({ statusCode, message }, amount);
  }

  /* ----------------- */

  createRsCashDepositRouteDto(
    statusCode: number,
    message: string,
  ): RsCashDepositRouteDto {
    return new RsCashDepositRouteDto({ statusCode, message });
  }

  /* ----------------- */

  createRsLoadedTransportRouteDto(
    statusCode: number,
    message: string,
  ): RsLoadedTransportRouteDto {
    return new RsLoadedTransportRouteDto({ statusCode, message });
  }

  createRsLoadedOrderDto(
    statusCode: number,
    message: string,
  ): RsLoadedOrderDto {
    return new RsLoadedOrderDto({ statusCode, message });
  }
}

/* ------------------------------------------------------- */
