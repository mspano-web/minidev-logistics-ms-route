import { RsGenericHeaderDto } from "./rs-generic-header.dto";

/* -------------------------------------- */

export class RsLoadedTransportRouteDto {
  rsGenericHeaderDto: RsGenericHeaderDto;

  constructor(
    rsGenericHeaderDto: RsGenericHeaderDto,
  ) {
    this.rsGenericHeaderDto = rsGenericHeaderDto;
  }
}

/* -------------------------------------- */

