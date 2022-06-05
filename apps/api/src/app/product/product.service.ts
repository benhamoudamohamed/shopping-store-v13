import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  private logger = new Logger('ProductService')

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>) { }

  async findAll(): Promise<Product[]>  {
    try {
      this.logger.log(`🟩 findAll Product successfully`);
      return await this.productRepository.find();
    }
    catch (error) {
      this.logger.error(`🟥 findAll Product catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findbyId(id: string): Promise<Product>  {
    const product = await this.productRepository.findOne({where: {id}, relations:['category']});
    if(!product) {
      this.logger.error(`🟥 findOne product not found with id: ${id}`)
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }
    try {
      this.logger.log(`🟩 findOne product successfully with id: ${id}`);
      return product;
    }
    catch (error) {
      this.logger.error(`🟥 findOne product catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByFavorite(isFavorite: boolean): Promise<any> {
    return await this.productRepository.find({where: {isFavorite}});
  }

  async create(data: CreateProductDto, catID: string): Promise<Product> {
    const category = await this.categoryRepository.findOne({where: {id: catID}});
    if(!category) {
      this.logger.error(`🟥 findOne category not found with id: ${catID}`)
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }

    const product = this.productRepository.create({...data, category});

    try {
      this.logger.log(`✅ create product successfully with name: ${product.name}`);
      return await this.productRepository.save(product);
    } catch(error) {
      this.logger.error(`🟥 create product catch error: ${error}`);
      if(error.code === '23505') {
        throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'إسم المنتج موجود في قاعدة البيانات',}, HttpStatus.FORBIDDEN);
      }
      else {
        throw new InternalServerErrorException(error)
      }
    }
  }

  async update(id: string, data: CreateProductDto, catID: string): Promise<Product> {
    const product = await this.findbyId(id)
    const category = await this.categoryRepository.findOne({where: {id: catID}});
    if(!category) {
      this.logger.error(`🟥 findOne category not found with id: ${catID}`)
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }

    try {
      await this.productRepository.update(product.id, {...data, category});
      this.logger.log(`🟩 update product successfully for: ${product.name}`);
      return await this.findbyId(id);
    } catch(error) {
      this.logger.error(`🟥 update product catch error: ${error}`);
      if(error.code === '23505') {
        throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'إسم المنتج موجود في قاعدة البيانات',}, HttpStatus.FORBIDDEN);
      }
      else {
        throw new InternalServerErrorException(error)
      }
    }
  }

  async delete(id: string): Promise<Product> {
    const product = await this.findbyId(id)
    try {
      await this.productRepository.delete(product.id)
      this.logger.log(`🟩 delete product successfully with name: ${product.name}`);
      return product;
    }
    catch (error) {
      this.logger.error(`🟥 delete product catch Error: ${error}`)
      throw new InternalServerErrorException(error)
    }
  }
}
