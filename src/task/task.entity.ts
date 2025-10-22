import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "./task.model";
import { User } from "src/user/user-entity";

@Entity()
export class Task {
        @Column()
        @PrimaryGeneratedColumn("uuid")
        id: string;
        @Column()
        
        title: string;
        @Column()
        description?: string;
        @Column({
            type:"enum",
            enum:Status,
            default: Status.IN_PROGRESS
        })
        completed: Status;
        @Column()
        userId:string
        
        @ManyToOne(()=>User,(user)=>user.tasks)
        user:User   

}