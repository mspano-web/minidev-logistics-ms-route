import { IsDateString, } from "class-validator";

/* -------------------------------------- */

export class RqGenerateRouteDto {
    @IsDateString()
    readonly date_generate: string;
}

/* -------------------------------------- */
