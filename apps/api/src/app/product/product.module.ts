import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';
import { Product } from './entities/product.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category, Product]),
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    HttpModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [PassportModule]
})
export class ProductModule {}
