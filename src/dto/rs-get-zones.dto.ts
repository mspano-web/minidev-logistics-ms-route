import { RsGenericHeaderDto } from './rs-generic-header.dto';

/* -------------------------------------- */

export class RsGetZonesDataDto {
  id: number;
  description: string;
}

/* ----------------------------------- */

export class RsGetZonesDto {
  rsGenericHeaderDto: RsGenericHeaderDto;
  rsGetZonesDataDto: RsGetZonesDataDto[];

  constructor(
    rsGenericHeaderDto: RsGenericHeaderDto,
    rsGetZonesDataDto: RsGetZonesDataDto[],
  ) {
    this.rsGenericHeaderDto = rsGenericHeaderDto;
    this.rsGetZonesDataDto = rsGetZonesDataDto;
  }
}

/* ----------------------------------- */
