import { Controller, } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import {
  RqCashDepositRouteDto,
  RqGenerateRouteDto,
  RqGetRouteAmountDto,
  RqGetRouteForMapDto,
  RqGetRouteOrdersDetailsDto,
  RqLoadedTransportRouteDto,
  RsCashDepositRouteDto,
  RsGetRouteAmountDto,
  RsGetRouteOrdersDetailsDto,
  RsLoadedOrderDto,
} from './dto';

/* ------------------------------------------------ */

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  /* -------------- */

  @EventPattern('generate-route')
  async generateRoute(payload: RqGenerateRouteDto) {
      await this.appService.generateRoute(payload.date_generate);
  }

  /* -------------- */

  @MessagePattern('get-route-for-map')
  async getRouteForMap(payload: RqGetRouteForMapDto) {
    const { date_route, transport_id } = payload;
      return await this.appService.getRouteForMap(
        date_route,
        transport_id,
      );
  }

  /* -------------- */
  
  @MessagePattern('get-route-orders-details')
  async getRouteOrderDetails(payload: RqGetRouteOrdersDetailsDto): Promise<RsGetRouteOrdersDetailsDto> {
    const { route_id } = payload;
    return await this.appService.getRouteOrderDetails(route_id);
  }

  /* -------------- */

  @MessagePattern('get-route-amount')
  async getRouteAmount(payload: RqGetRouteAmountDto): Promise<RsGetRouteAmountDto> {
    const { route_id } = payload;
      return  await this.appService.getRouteAmount(route_id);
  }

    /* -------------- */

  @MessagePattern('cash-deposited')
  async cashDeposited(payload: RqCashDepositRouteDto): Promise<RsCashDepositRouteDto> {
    const { route_id } = payload;
      return await this.appService.cashDeposited(route_id);
  }

    /* -------------- */
    
  @MessagePattern('loaded-transport')
  async loadedTransport(payload: RqLoadedTransportRouteDto): Promise<RsLoadedOrderDto> {
    const { route_id } = payload;
      return await this.appService.loadedTransport(route_id);
  }
}

/* ------------------------------------------------ */
