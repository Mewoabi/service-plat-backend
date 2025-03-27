import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    return this.prisma.payment.create({
      data: {
        ...createPaymentDto,
        status: 'pending',
      },
      include: {
        contract: true,
      },
    });
  }

  async findAll(filters?: { contractId?: string; status?: string }) {
    const where: any = {};
    
    if (filters?.contractId) {
      where.contractId = filters.contractId;
    }
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    return this.prisma.payment.findMany({
      where,
      include: {
        contract: {
          include: {
            proposal: {
              include: {
                freelancer: true,
                job: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        contract: {
          include: {
            proposal: {
              include: {
                freelancer: true,
                job: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    // First check if the payment exists
    await this.findOne(id);
    
    return this.prisma.payment.update({
      where: { id },
      data: updatePaymentDto,
      include: {
        contract: true,
      },
    });
  }

  async remove(id: string) {
    // First check if the payment exists
    await this.findOne(id);
    
    return this.prisma.payment.delete({
      where: { id },
    });
  }

  async findByContract(contractId: string) {
    return this.findAll({ contractId });
  }

  async updatePaymentStatus(id: string, status: PaymentStatus) {
    // First check if the payment exists
    await this.findOne(id);
    
    return this.prisma.payment.update({
      where: { id },
      data: { status },
      include: {
        contract: true,
      },
    });
  }
}
