import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

/* -------------------------------------- */

@Exclude()
export class RqGetOrderDto {
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

/* -------------------------------------- */
