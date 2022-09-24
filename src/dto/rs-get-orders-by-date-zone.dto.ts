import { RsGenericHeaderDto } from './rs-generic-header.dto';

/* -------------------------------------- */

export class RsGetOrdersByDateZoneDetails {
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}

/* -------------------------------------- */

export class RsGetOrdersByDateZoneDto {

  rsGenericHeaderDto: RsGenericHeaderDto;
  rqGetOrdersDto: RsGetOrdersByDateZoneDetails[];

  constructor(
    rsGenericHeaderDto: RsGenericHeaderDto,
    rqGetOrdersDto: RsGetOrdersByDateZoneDetails[],
  ) {
    this.rsGenericHeaderDto = rsGenericHeaderDto;
    this.rqGetOrdersDto = rqGetOrdersDto;
  }

}

/* -------------------------------------- */
