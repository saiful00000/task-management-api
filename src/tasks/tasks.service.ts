import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {

  constructor(private prisma: PrismaService) { }

  async create(createTaskDto: CreateTaskDto, userId: number) {
    return await this.prisma.task.create({
      data: { ...createTaskDto, userId: userId }
    });
  }

  async findAll(userId: number) {
    return await this.prisma.task.findMany({ where: { userId: userId } });
  }

  async findOne(id: number, userId: number) {
    // We use findFirst because findUnique requires only unique fields in the where clause
    const task = await this.prisma.task.findFirst({ where: { id: id, userId: userId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    await this.findOne(id, userId);
    return await this.prisma.task.update({
      where: { id: id },
      data: updateTaskDto,
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    return await this.prisma.task.delete(
      {
        where: { id: id }
      }
    );
  }
}
