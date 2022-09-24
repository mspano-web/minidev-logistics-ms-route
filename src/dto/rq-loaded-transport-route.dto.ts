import { IsString } from 'class-validator';

/* -------------------------------------- */

export class RqLoadedTransportRouteDto {
  @IsString()
  readonly route_id: string;
}

/* -------------------------------------- */

