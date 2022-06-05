import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from "@nestjs/axios";
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    HttpModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [PassportModule]
})
export class UserModule {}
