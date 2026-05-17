import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {

  constructor(private prisma: PrismaService) { }

  async create(createTaskDto: CreateTaskDto, userId: number) {
    return await this.prisma.task.create({
      data: { ...createTaskDto, userId: userId }
    });
  }

  async findAll(filterDto: GetTaskFilterDto, userId: number) {
    const { status, page = 1, limit = 10 } = filterDto;

    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    const [tasks, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      items: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
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
