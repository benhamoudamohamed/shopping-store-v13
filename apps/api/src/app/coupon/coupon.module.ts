import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Coupon } from './entities/coupon.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Coupon]),
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    HttpModule,
  ],
  controllers: [CouponController],
  providers: [CouponService],
  exports: [PassportModule]
})
export class CouponModule {}
