import { RsGenericHeaderDto } from './rs-generic-header.dto';
import { StateType } from '../types/enums';

/* ------------------------------------------------- */

export class RsGetOrderDetailsDto {
  product_id: string;
  quantity: number;

  constructor( product_id: string, quantity: number) {
    this.product_id = product_id;
    this.quantity= quantity;
  }
}

/* --------------- */

export class RsGetOrderHeaderDto {
  state: StateType;
  date_delivery: string;
  client_id: number;
  amount: number;
  rsGetOrderDetails: RsGetOrderDetailsDto[];

  constructor( amount: number, client_id: number, date_delivery: string, state: StateType,
    rsGetOrderDetails: RsGetOrderDetailsDto[]) {
    this.amount = amount;
    this.client_id= client_id;
    this.date_delivery = date_delivery;
    this.state = state;
    this.rsGetOrderDetails = rsGetOrderDetails;
  }

}

/* --------------- */

export class RsGetOrderDto {
  rsGenericHeaderDto: RsGenericHeaderDto;
  rsGetOrderHeaderDto: RsGetOrderHeaderDto;

  constructor(
    rsGenericHeaderDto: RsGenericHeaderDto,
    rsGetOrderHeaderDto: RsGetOrderHeaderDto,
  ) {
    this.rsGenericHeaderDto = rsGenericHeaderDto;
    this.rsGetOrderHeaderDto = rsGetOrderHeaderDto;
  }

}

/* -------------------------------------- */
