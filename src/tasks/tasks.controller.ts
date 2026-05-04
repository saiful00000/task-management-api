import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  @ResponseMessage('Task created successfully.')
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() userId: number) {
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  @ResponseMessage('Tasks retrieved successfully.')
  findAll(@CurrentUser() userId: number) {
    return this.tasksService.findAll(userId);
  }

  @Get(':id')
  @ResponseMessage('Task retrieved successfully.')
  findOne(@Param('id') id: string, @CurrentUser() userId: number) {
    return this.tasksService.findOne(+id, userId);
  }

  @Patch(':id')
  @ResponseMessage('Task updated successfully.')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @CurrentUser() userId: number) {
    return this.tasksService.update(+id, updateTaskDto, userId);
  }

  @Delete(':id')
  @ResponseMessage('Task deleted successfully.')
  remove(@Param('id') id: string, @CurrentUser() userId: number) {
    return this.tasksService.remove(+id, userId);
  }
}
