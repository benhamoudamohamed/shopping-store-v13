import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Purchase } from './entities/purchase.entity';
import { CustomAuthGuard } from '../shared/auth.guard';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @UseGuards(CustomAuthGuard)
  @Get()
  findAll(): Promise<Purchase[]> {
    return this.purchaseService.findAll();
  }

  @UseGuards(CustomAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Purchase> {
    return this.purchaseService.findbyId(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreatePurchaseDto): Promise<Purchase> {
    return this.purchaseService.create(data);
  }

  @UseGuards(CustomAuthGuard)
  @Delete('/:id')
  delete(@Param('id') id: string): Promise<Purchase> {
    return this.purchaseService.delete(id);
  }
}
