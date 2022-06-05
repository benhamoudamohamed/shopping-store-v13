import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    MulterModule.registerAsync({
      useFactory: () => ({})
    }),
    HttpModule,
  ],
  controllers: [FileController],
  exports: [PassportModule]
})
export class FileModule {}
