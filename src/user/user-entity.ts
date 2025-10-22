import { Task } from "src/task/task.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
export enum Role {
    ADMIN = 'admin',
    USER = 'user',
  }
@Entity()
export class User{
    @PrimaryGeneratedColumn("uuid")
    id:string
    @Column()
    firstName:string
    @Column()
    lastName:string
    @Column()
    password:string
    @Column()
    
    email:string
    
    @CreateDateColumn()
    createAt:Date

    @UpdateDateColumn()
    updateAt:Date
    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER,
      })
      role: Role;
    @OneToMany(()=>Task,task=>task.id)
    tasks:Task[]

}