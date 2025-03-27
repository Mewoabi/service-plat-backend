import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JobStatus } from '@prisma/client';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        ...createJobDto,

        budget: Number(createJobDto.budget),
        numberOfSlots: Number(createJobDto.numberOfSlots),
        acceptedSlots: 0,
        status: 'open',
      },
    });
  }

  async findAll(filters?: { category?: string; status?: string; clientId?: string }) {
    const where: any = {};
    
    if (filters?.category) {
      where.category = filters.category;
    }
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.clientId) {
      where.clientId = filters.clientId;
    }
    
    return this.prisma.job.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
        proposals: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            profile: true,
          },
        },
        proposals: {
          include: {
            freelancer: {
              select: {
                id: true,
                email: true,
                profile: true,
              },
            },
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    // First check if the job exists
    await this.findOne(id);
    
    return this.prisma.job.update({
      where: { id },
      data: updateJobDto,
    });
  }

  async remove(id: string) {
    // First check if the job exists
    await this.findOne(id);
    
    return this.prisma.job.delete({
      where: { id },
    });
  }

  async findByClient(clientId: string) {
    return this.findAll({ clientId });
  }

  async updateJobStatus(id: string, status: JobStatus) {
    // First check if the job exists
    await this.findOne(id);
    
    return this.prisma.job.update({
      where: { id },
      data: { status },
    });
  }

  async incrementAcceptedSlots(id: string) {
    const job = await this.findOne(id);
    
    if (job.acceptedSlots >= job.numberOfSlots) {
      throw new Error('All slots for this job have been filled');
    }
    
    const updatedJob = await this.prisma.job.update({
      where: { id },
      data: { 
        acceptedSlots: { increment: 1 },
      },
    });
    
    // If all slots are now filled, update the status to 'in_progress'
    if (updatedJob.acceptedSlots >= updatedJob.numberOfSlots) {
      return this.updateJobStatus(id, 'in_progress');
    }
    
    return updatedJob;
  }
}
