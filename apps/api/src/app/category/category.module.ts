import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Category } from './entities/category.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Category]),
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    HttpModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [PassportModule]
})
export class CategoryModule {}
