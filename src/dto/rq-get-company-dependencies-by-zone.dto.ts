import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

/* -------------------------------------- */

@Exclude()
export class RqGetCompanyDependenciesByZoneDto {
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    id: number;
}

/* -------------------------------------- */
