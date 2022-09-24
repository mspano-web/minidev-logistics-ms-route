import { RsGenericHeaderDto } from "./rs-generic-header.dto";

/* -------------------------------------- */

export class RsCashDepositRouteDto {
  rsGenericHeaderDto: RsGenericHeaderDto;

  constructor(
    rsGenericHeaderDto: RsGenericHeaderDto,
  ) {
    this.rsGenericHeaderDto = rsGenericHeaderDto;
  }
}

/* -------------------------------------- */

