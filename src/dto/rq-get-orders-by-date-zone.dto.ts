import { Exclude, Expose } from "class-transformer";
import { IsDateString, IsNumber, IsPositive,  } from "class-validator";

/* -------------------------------------- */

@Exclude()
export class RqGetOrdersByDateZoneDto {
    @Expose()
    @IsDateString()
    date_delivery: string;

    @Expose()
    @IsPositive()
    @IsNumber()
    zone_id: number;
}

/* -------------------------------------- */
