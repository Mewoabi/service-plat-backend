import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpCode, BadRequestException, ParseEnumPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from '@prisma/client';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  findAll(
    @Query('contractId') contractId?: string,
    @Query('status') status?: string,
  ) {
    return this.paymentService.findAll({ contractId, status });
  }

  @Get('contract/:contractId')
  findByContract(@Param('contractId') contractId: string) {
    return this.paymentService.findByContract(contractId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status', new ParseEnumPipe(Object.values(PaymentStatus))) status: PaymentStatus
  ) {
    return this.paymentService.updatePaymentStatus(id, status as PaymentStatus);
  }
}
