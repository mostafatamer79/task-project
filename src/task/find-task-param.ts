import { IsEnum, IsOptional,  } from "class-validator";
import { Status } from "./task.model";

export class findTaskParams{
    @IsOptional()
    @IsEnum(Status)
    completed? :Status
}