import { CreateTaskDto } from "./create-task.dto";
import { PartialType } from "@nestjs/mapped-types";

export default class UpdateTaskDto extends PartialType(CreateTaskDto) {

}
