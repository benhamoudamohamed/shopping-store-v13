import { Module } from '@nestjs/common';
import { ContactusService } from './contactus.service';
import { ContactusController } from './contactus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contactus } from './entities/contactus.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contactus])
  ],
  controllers: [ContactusController],
  providers: [ContactusService]
})
export class ContactusModule {}
