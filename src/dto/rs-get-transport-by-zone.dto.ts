import { RsGenericHeaderDto } from 'src/dto/rs-generic-header.dto';

/* ----------------------------------- */


export class RsGetTransportByZoneDto {
  rsGenericHeaderDto: RsGenericHeaderDto;
  rsGetTransportByZoneDataDto: number[];

  constructor(
    rsGenericHeaderDto: RsGenericHeaderDto,
    transports: number[],
  ) {
    this.rsGenericHeaderDto = rsGenericHeaderDto;
    this.rsGetTransportByZoneDataDto = transports;
  }

}

/* ----------------------------------- */

