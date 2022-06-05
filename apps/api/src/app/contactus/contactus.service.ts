import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailContact } from '../shared/sendEmail-contact';
import { CreateContactusDto } from './dto/create-contactus.dto';
import { Contactus } from './entities/contactus.entity';

@Injectable()
export class ContactusService {

  private logger = new Logger('ContactusService')

  constructor(
    @InjectRepository(Contactus)
    private contactusRepository: Repository<Contactus>) { }


  async create(data: CreateContactusDto): Promise<Contactus>  {
    const contactus = this.contactusRepository.create({...data});

    const subject = 'Contactus';
    const header = 'You have a new Contact-us';
    const email = contactus.email
    const fullname = contactus.fullname
    const phone = contactus.phone
    const formSubject = contactus.subject
    const message = contactus.message

    try {
      await this.contactusRepository.save(contactus);
      try {
        await EmailContact(subject, header, email, fullname, phone, formSubject, message)
      }catch(error) {
        throw new HttpException({status: HttpStatus.NOT_ACCEPTABLE, error: 'mail sent rejected',}, HttpStatus.NOT_ACCEPTABLE);
      }
      this.logger.log(`✅ create contactus successfully from ${contactus.email}`);
      return contactus;
    } catch(error) {
      this.logger.error(`🟥 contactus catch error: ${error}`);
      throw new InternalServerErrorException(error)
    }
  }
}
