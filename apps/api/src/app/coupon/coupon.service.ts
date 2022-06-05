import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UserLimitDto } from './dto/userLimit.dto';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponService {
  private logger = new Logger('CouponService')

  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>) { }

  async findAll(): Promise<Coupon[]>  {
    try {
      this.logger.log(`🟩 findAll Coupon successfully`);
      return await this.couponRepository.find();
    }
    catch (error) {
      this.logger.error(`🟥 findAll Coupon catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findbyId(id: string): Promise<Coupon>  {
    const coupon = await this.couponRepository.findOne({where: {id}});
    if(!coupon) {
      this.logger.error(`🟥 findOne Coupon not found with id: ${id}`)
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }
    try {
      this.logger.log(`🟩 findOne Coupon successfully with id: ${id}`);
      return coupon;
    }
    catch (error) {
      this.logger.error(`🟥 findOne Coupon catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByCoupon(code: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({where: {code}});
    if(!coupon) {
      this.logger.error(`🟥 findByCoupon not found with code: ${code}`)
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }
    try {
      this.logger.log(`🟩 findByCoupon successfully with code: ${code}`);
      return coupon;
    }
    catch (error) {
      this.logger.error(`🟥 findOne Coupon catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(data: CreateCouponDto): Promise<Coupon> {
    const coupon = this.couponRepository.create({...data});

    try {
      this.logger.log(`✅ create Coupon successfully with name: ${coupon.code}`);
      return await this.couponRepository.save(coupon);
    } catch(error) {
      this.logger.error(`🟥 create coupon catch error: ${error}`);
      if(error.code === '23505') {
        throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'رمز الكوبون موجود في قاعدة البيانات',}, HttpStatus.FORBIDDEN);
      }
      else {
        throw new InternalServerErrorException(error)
      }
    }
  }

  async update(id: string, data: CreateCouponDto): Promise<Coupon> {
    const coupon = await this.findbyId(id)
    try {
      await this.couponRepository.update(coupon.id, {...data});
      this.logger.log(`🟩 update Coupon successfully for: ${coupon.code}`);
      return await this.findbyId(id);
    } catch(error) {
      this.logger.error(`🟥 update Coupon catch error: ${error}`);
      if(error.code === '23505') {
        throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'رمز الكوبون موجود في قاعدة البيانات',}, HttpStatus.FORBIDDEN);
      }
      else {
        throw new InternalServerErrorException(error)
      }
    }
  }

  async updateUserLimit(id: string, data: UserLimitDto): Promise<Coupon> {
    const coupon = await this.findbyId(id)
    try {
      await this.couponRepository.update(coupon.id, {...data});
      this.logger.log(`🟩 update User Limit successfully for: ${coupon.code}`);
      return await this.findbyId(id);
    } catch(error) {
      this.logger.error(`🟥 update User Limit catch error: ${error}`);
      if(error.code === '23505') {
        throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'رمز الكوبون موجود في قاعدة البيانات',}, HttpStatus.FORBIDDEN);
      }
      else {
        throw new InternalServerErrorException(error)
      }
    }
  }

  async delete(id: string): Promise<Coupon> {
    const coupon = await this.findbyId(id)
    try {
      await this.couponRepository.delete(coupon.id)
      this.logger.log(`🟩 delete Coupon successfully with name: ${coupon.code}`);
      return coupon;
    }
    catch (error) {
      this.logger.error(`🟥 delete Coupon catch Error: ${error}`)
      throw new InternalServerErrorException(error)
    }
  }
}
