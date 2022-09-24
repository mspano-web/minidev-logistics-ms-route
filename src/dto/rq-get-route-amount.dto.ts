import { IsString } from 'class-validator';

/* -------------------------------------- */

export class RqGetRouteAmountDto {
  @IsString()
  readonly route_id: string;
}

/* -------------------------------------- */

