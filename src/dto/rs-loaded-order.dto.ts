import { RsGenericHeaderDto } from "./rs-generic-header.dto";

/* -------------------------------------- */

export class RsLoadedOrderDto {
  rsGenericHeaderDto: RsGenericHeaderDto;

  constructor(
    rsGenericHeaderDto: RsGenericHeaderDto,
  ) {
    this.rsGenericHeaderDto = rsGenericHeaderDto;
  }
}

/* -------------------------------------- */
