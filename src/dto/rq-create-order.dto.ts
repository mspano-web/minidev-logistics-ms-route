import { IsDateString, IsEnum, IsNumber, IsPositive, IsString,  } from "class-validator";
import { StateType } from "../types/enums"

/* -------------------------------------- */

export class RqCreateOrderDetailsDto {
  @IsString()
  product_id: string;

  @IsNumber()
  quantity: number;
}

/* -------------------------------------- */

export class RqCreateOrderDto {

    @IsEnum(StateType)
    state: StateType;

    @IsDateString()
    date_delivery: string;

    @IsPositive()
    @IsNumber()
    client_id: number;

    @IsPositive()
    @IsNumber()
    amount: number;

    rqCreateOrderDetailsDto: RqCreateOrderDetailsDto[];
}

/* -------------------------------------- */
