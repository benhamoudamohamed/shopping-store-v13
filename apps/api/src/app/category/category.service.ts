import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  private logger = new Logger('CategoryService')

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>) { }


  async findAll(): Promise<Category[]>  {
    try {
      this.logger.log(`🟩 findAll Category successfully`);
      return await this.categoryRepository.find();
    }
    catch (error) {
      this.logger.error(`🟥 findAll Category catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllbyPagination(options: IPaginationOptions): Promise<Pagination<Category>> {
    const queryBuilder = this.categoryRepository
    .createQueryBuilder("category")
    .orderBy('category.created', 'DESC')

    try {
      this.logger.log(`🟩 findAll Category byPagination successfully`);
      return paginate<Category>(queryBuilder, options);

    } catch (error) {
      this.logger.error(`🟥 findAll Category byPagination catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findbyId(id: string): Promise<Category>  {
    const category = await this.categoryRepository.findOne({where: {id}, relations:['products']});
    if(!category) {
      this.logger.error(`🟥 findOne Category not found with id: ${id}`)
      throw new HttpException({status: HttpStatus.NOT_FOUND, error: 'معلومات خاطئة', }, HttpStatus.NOT_FOUND);
    }
    try {
      this.logger.log(`🟩 findOne Category successfully with id: ${id}`);
      return category;
    }
    catch (error) {
      this.logger.error(`🟥 findOne Category catch Error: ${error}`)
      throw new HttpException({status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'خطأ من الخادم الداخلي', }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create({...data});
    try {
      this.logger.log(`✅ create Category successfully with ${category.name}`);
      return await this.categoryRepository.save(category);;
    } catch(error) {
      this.logger.error(`🟥 create Category catch error: ${error}`);
      if(error.code === '23505') {
        throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'إسم فئة المنتجات موجود في قاعدة البيانات',}, HttpStatus.FORBIDDEN);
      }
      else {
        throw new InternalServerErrorException(error)
      }
    }
  }

  async update(id: string, data: CreateCategoryDto): Promise<Category> {
    const category = await this.findbyId(id)
    try {
      await this.categoryRepository.update(category.id , {...data});
      this.logger.log(`🟩 update Category successfully for: ${id}`);
      return await this.findbyId(id);
    } catch(error) {
      this.logger.error(`🟥 create Category catch error: ${error}`);
      if(error.code === '23505') {
        throw new HttpException({status: HttpStatus.FORBIDDEN, error: 'إسم فئة المنتجات موجود في قاعدة البيانات',}, HttpStatus.FORBIDDEN);
      }
      else {
        throw new InternalServerErrorException(error)
      }
    }
  }

  async delete(id: string): Promise<Category> {
    const category = await this.findbyId(id)
    try {
      await this.categoryRepository.delete(category.id)
      this.logger.log(`🟩 delete Category successfully with name: ${category.name}`);
      return category;
    }
    catch (error) {
      this.logger.error(`🟥 delete Category catch Error: ${error}`)
      throw new InternalServerErrorException(error)
    }
  }
}
