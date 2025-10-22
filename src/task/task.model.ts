import { UUID } from "crypto";

export interface ITask {
    id: string;
    title: string;
    description?: string;
    completed: Status;
}

export enum Status {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
}