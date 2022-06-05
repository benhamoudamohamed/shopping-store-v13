import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Purchase } from './entities/purchase.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Purchase]),
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    HttpModule,
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PassportModule]
})
export class PurchaseModule {}
