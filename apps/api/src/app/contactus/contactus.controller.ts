import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ContactusService } from './contactus.service';
import { CreateContactusDto } from './dto/create-contactus.dto';

@Controller('contactus')
export class ContactusController {
  constructor(private readonly contactusService: ContactusService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateContactusDto) {
    return this.contactusService.create(data);
  }
}
