import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

/* -------------------------------------- */

@Exclude()
export class RqGetTransporByZoneDto {
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    zone_id: number;
}

/* -------------------------------------- */
