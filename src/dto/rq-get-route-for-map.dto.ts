import { IsDateString,  IsString } from 'class-validator';

/* -------------------------------------- */

export class RqGetRouteForMapDto {
  @IsDateString()
  readonly date_route: string;
  @IsString()
  readonly transport_id: string;
}

/* -------------------------------------- */
