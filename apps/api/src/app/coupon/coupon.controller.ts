import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { CustomAuthGuard } from '../shared/auth.guard';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UserLimitDto } from './dto/userLimit.dto';
import { Coupon } from './entities/coupon.entity';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Coupon[]> {
    return this.couponService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<Coupon> {
    return this.couponService.findbyId(id);
  }

  @Get('findByCoupon/:id')
  @HttpCode(HttpStatus.OK)
  findByCoupon(@Param('id') id: string): Promise<Coupon> {
    return this.couponService.findByCoupon(id);
  }

  @UseGuards(CustomAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateCouponDto): Promise<Coupon> {
    return this.couponService.create(data);
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  update(@Param('id') id: string, @Body() data: CreateCouponDto): Promise<Coupon> {
    return this.couponService.update(id, data);
  }

  @Put(':id/userLimit')
  @HttpCode(HttpStatus.CREATED)
  updateUserLimit(@Param('id') id: string, @Body() data: UserLimitDto): Promise<Coupon> {
    return this.couponService.updateUserLimit(id, data);
  }

  @UseGuards(CustomAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string): Promise<Coupon> {
    return this.couponService.delete(id);
  }
}
