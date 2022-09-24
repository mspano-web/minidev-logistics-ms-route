import { RsCashDepositRouteDto, RsGetRouteAmountDto, RsGetRouteOrdersDetailsDto, RsLoadedOrderDto, RsLoadedTransportRouteDto } from "src/dto";
import { RsRouteOrderDetailDto } from "src/dto/rs-get-orders-details-route.dto";
import { RoutesDetailsEntity, RsGetRouteForMapDto, RsRouteDetailDto } from "src/dto/rs-get-route-for-map.dto";
import { RoutesHeaderEntity } from "src/entity/route-entity";
import { RouteOrderDetails } from "src/types/routeOrderDetails.business";

//   interface and provide that token when injecting to an interface type.
export const RQ_RS_FACTORY_SERVICE = 'RQ_RS_FACTORY_SERVICE';

/* ----------------------- */

export interface IRqRsFactory {

  createRoutesHeaderEntity(
    transport_id: number,
    origin_id: number,
    destination_id: number,
    zone_id: number,
    routesDetails: RoutesDetailsEntity[],
  ): RoutesHeaderEntity;

  /* ------------ */

  createRoutesDetailsEntity(
    order_id: number
  ): RoutesDetailsEntity;

  /* ------------ */

  createRsRouteForMap(
    statusCode: number,
    message: string,
    rsRouteDetailDto: RsRouteDetailDto,
  ): RsGetRouteForMapDto;

  /* ------------ */

  createRsGetRouteOrdersDetailsDto(
    statusCode: number,
    message: string,
    rsRouteOrderDetailDto: RsRouteOrderDetailDto[]
  ): RsGetRouteOrdersDetailsDto;

  /* ------------ */

  createRouteOrderDetails(
    product_id: string,
    description: string,
    quantity: number
  ): RouteOrderDetails;

  /* ------------ */

  createRsGetRouteAmountDto(
    statusCode: number,
    message: string,
    amount: number
  ): RsGetRouteAmountDto;

  /* ------------ */

  createRsCashDepositRouteDto(
    statusCode: number,
    message: string,
  ): RsCashDepositRouteDto;

  /* ------------ */

  createRsLoadedTransportRouteDto(
    statusCode: number,
    message: string,
  ): RsLoadedTransportRouteDto;

  /* ------------ */

  createRsLoadedOrderDto(
    statusCode: number,
    message: string,
  ): RsLoadedOrderDto;
  
}

/* ----------------------- */
