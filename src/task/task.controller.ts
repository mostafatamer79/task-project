import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
    HttpCode,
    HttpStatus,
    Query,
  } from '@nestjs/common';
  import { TaskService } from './task.service';
  import { CreateTaskDto } from './create-task.dto';
  import UpdateTaskDto from './update-task.dto';
  import { Task } from './task.entity';
  import { findTaskParams } from './find-task-param';
  import { PagninationParams } from 'src/common/pagnination.params';
  import { PagninationResponse } from 'src/common/pagniniation.response';
  import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
  import { RolesGuard } from 'src/common/guards/roles.guard';
  import { Roles } from 'src/common/decorators/roles.decorators';
  import { Role } from 'src/user/user-entity';
  
  @Controller('tasks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class TaskController {
    constructor(private readonly taskService: TaskService) {}
  
    @Get()
    @Roles(Role.ADMIN, Role.USER)
    public async getTasks(
      @Query() filters: findTaskParams,
      @Query() pagnination: PagninationParams,
    ): Promise<PagninationResponse<Task>> {
      const [items, total] = await this.taskService.getAllTasks(filters, pagnination);
      return {
        data: items,
        meta: {
          total: total,
          ...pagnination,
        },
      };
    }
  
    @Get('/:id')
    @Roles(Role.ADMIN, Role.USER)
    public async getTaskById(
      @Param('id', new ParseUUIDPipe()) id: string,
    ): Promise<Task> {
      return this.taskService.getTaskById(id);
    }
  
    @Post()
    @Roles(Role.ADMIN, Role.USER)
    @HttpCode(HttpStatus.CREATED)
    public async createTask(
      @Body() createTaskDto: CreateTaskDto,
    ): Promise<Task> {
      return this.taskService.createTask(createTaskDto);
    }
  
    @Patch('/:id')
    @Roles(Role.ADMIN, Role.USER)
    public async updateTask(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Body() updateTaskDto: UpdateTaskDto,
    ): Promise<Task> {
      return this.taskService.updateTask(id, updateTaskDto);
    }
  
    @Delete('/:id')
    @Roles(Role.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteTask(
      @Param('id', new ParseUUIDPipe()) id: string,
    ): Promise<void> {
      await this.taskService.deleteTask(id);
    }
  }
  