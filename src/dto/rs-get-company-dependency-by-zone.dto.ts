import { RsGenericHeaderDto } from 'src/dto/rs-generic-header.dto';

/* -------------------------------------------------- */

export class PointDto {
  latitude: number;
  longitud: number;
}

/* ------------- */
export class RsGetCompanyDependencyDataByZoneDto {
  id: number;
  description: string;
  dependencyType: string;
  zone_id: number;
  address: string;
  position: PointDto;
}

/* --------------- */

export class RsGetCompanyDependencyByZoneDto {
  rsGenericHeaderDto: RsGenericHeaderDto;
  rsGetCompanyDependencyDataByZoneDto:  RsGetCompanyDependencyDataByZoneDto[];
}

/* -------------------------------------------------- */
