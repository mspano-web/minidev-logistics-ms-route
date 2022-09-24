import {  IsString, } from "class-validator";

/* -------------------------------------- */

export class RqCashDepositRouteDto {

  @IsString()
  readonly route_id: string;
}

/* -------------------------------------- */
