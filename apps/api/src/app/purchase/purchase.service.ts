import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailPurchase } from '../shared/sendEmail-purchase';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Purchase } from './entities/purchase.entity';

@Injectable()
export class PurchaseService {

  private logger = new Logger('PurchaseService')

  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>) { }

  async findAll(): Promise<Purchase[]>  {
    try {
      this.logger.log(`🟩 findAll Purchase successfully`);
      return await this.purchaseRepository.find();
    }
    catch (error) {
      this.logger.error(`🟥 findAll Purchase catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findbyId(id: string): Promise<Purchase>  {
    const purchase = await this.purchaseRepository.findOne({where: {id}});
    if(!purchase) {
      this.logger.error(`🟥 findOne Purchase not found with id: ${id}`)
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }
    try {
      this.logger.log(`🟩 findOne Purchase successfully with id: ${id}`);
      return purchase;
    }
    catch (error) {
      this.logger.error(`🟥 findOne Purchase catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(data: CreatePurchaseDto): Promise<Purchase> {
    const purchase = this.purchaseRepository.create({...data});

    const subject = 'Purchase';
    const header = 'You have a new Purchase';
    const email = purchase.email
    const clientName = purchase.clientName
    const phone = purchase.phone
    const address = purchase.address

    try {
      try {
        await EmailPurchase(subject, email, clientName, header, phone, address)
        this.logger.log(`✅ Sending EmailPurchase successfully with email: ${purchase.email}`);
      }catch(error) {
        this.logger.error(`🟥 Sending EmailPurchase catch error: ${error}`);
        throw new HttpException({status: HttpStatus.NOT_ACCEPTABLE, error: 'mail sent rejected',}, HttpStatus.NOT_ACCEPTABLE);
      }
      this.logger.log(`✅ create Purchase successfully with email: ${purchase.email}`);
      return await this.purchaseRepository.save(purchase);
    } catch(error) {
      this.logger.error(`🟥 create Purchase catch error: ${error}`);
      throw new InternalServerErrorException(error)
    }
  }

  async delete(id: string): Promise<Purchase> {
    const purchase = await this.findbyId(id)
    try {
      await this.purchaseRepository.delete(purchase.id)
      this.logger.log(`🟩 delete Purchase successfully with email: ${purchase.email}`);
      return purchase;
    }
    catch (error) {
      this.logger.error(`🟥 delete Purchase catch Error: ${error}`)
      throw new InternalServerErrorException(error)
    }
  }
}
