import { RsGenericHeaderDto } from "./rs-generic-header.dto";

/* -------------------------------------- */

export class RsGetRouteAmountDto {
  rsGenericHeaderDto: RsGenericHeaderDto;
  amount: number;

  constructor(
    rsGenericHeaderDto: RsGenericHeaderDto,
    amount: number,
  ) {
    this.rsGenericHeaderDto = rsGenericHeaderDto;
    this.amount = amount;
  }

}

/* -------------------------------------- */

