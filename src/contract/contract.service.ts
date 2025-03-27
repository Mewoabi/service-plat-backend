import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ContractStatus } from '@prisma/client';

@Injectable()
export class ContractService {
  constructor(private prisma: PrismaService) {}

  async create(createContractDto: CreateContractDto) {
    return this.prisma.contract.create({
      data: {
        ...createContractDto,
        escrowAmount: Number(createContractDto.escrowAmount),
        status: createContractDto.status || 'active',
      },
      include: {
        proposal: {
          include: {
            freelancer: true,
            job: true,
          },
        },
        payments: true,
        reviews: true,
        User: true,
      },
    });
  }

  async findAll(filters?: { userId?: string; status?: string }) {
    const where: any = {};
    
    if (filters?.userId) {
      where.userId = filters.userId;
    }
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    return this.prisma.contract.findMany({
      where,
      include: {
        proposal: {
          include: {
            freelancer: true,
            job: true,
          },
        },
        payments: true,
        reviews: true,
        User: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        proposal: {
          include: {
            freelancer: true,
            job: true,
          },
        },
        payments: true,
        reviews: true,
        User: true,
      },
    });

    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    return contract;
  }

  async update(id: string, updateContractDto: UpdateContractDto) {
    // First check if the contract exists
    await this.findOne(id);
    
    return this.prisma.contract.update({
      where: { id },
      data: updateContractDto,
      include: {
        proposal: {
          include: {
            freelancer: true,
            job: true,
          },
        },
        payments: true,
        reviews: true,
        User: true,
      },
    });
  }

  async remove(id: string) {
    // First check if the contract exists
    await this.findOne(id);
    
    return this.prisma.contract.delete({
      where: { id },
    });
  }

  async findByUser(userId: string) {
    return this.findAll({ userId });
  }

  async updateContractStatus(id: string, status: ContractStatus) {
    // First check if the contract exists
    await this.findOne(id);
    
    return this.prisma.contract.update({
      where: { id },
      data: { status },
      include: {
        proposal: {
          include: {
            freelancer: true,
            job: true,
          },
        },
        payments: true,
        reviews: true,
        User: true,
      },
    });
  }
}
