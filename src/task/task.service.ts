import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './create-task.dto';
import  UpdateTaskDto  from './update-task.dto';
import { Status } from './task.model';
import { findTaskParams } from './find-task-param';
import { PagninationParams } from 'src/common/pagnination.params';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  public async getAllTasks(filters:findTaskParams ,pagnination:PagninationParams): Promise<[Task[], number]> {
    return await this.taskRepository.findAndCount({
        where:{
            completed:filters.completed
        },
        skip:pagnination.offset,
        take:pagnination.limit,
        

    });
  }

  public async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  public async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, completed, userId } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      completed: completed || Status.PENDING,
      user: { id: userId } 
    });
    return await this.taskRepository.save(task);
  }

  public async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  public async deleteTask(id: string): Promise<void> {
    const task = await this.getTaskById(id);
    await this.taskRepository.remove(task);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
