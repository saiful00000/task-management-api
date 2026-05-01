import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {

  constructor(private prisma: PrismaService) { }

  async create(createTaskDto: CreateTaskDto) {
    return await this.prisma.task.create({
      data: createTaskDto
    });
  }

  async findAll() {
    return await this.prisma.task.findMany();
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id: id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id);
    return await this.prisma.task.update({
      where: { id: id },
      data: updateTaskDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id)
    return await this.prisma.task.delete(
      {
        where: { id: id }
      }
    );
  }
}
