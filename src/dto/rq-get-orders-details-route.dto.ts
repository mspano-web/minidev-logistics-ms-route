import { IsString } from 'class-validator';

/* -------------------------------------- */

export class RqGetRouteOrdersDetailsDto {
  @IsString()
  readonly route_id: string;
}

/* -------------------------------------- */
