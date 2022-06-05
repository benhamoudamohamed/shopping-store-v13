import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, Put, Query, UseGuards } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CustomAuthGuard } from '../shared/auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAllbyPagination(@Query('page') page = 1, @Query('size') limit = 20): Promise<Pagination<Category>> {
    return this.categoryService.findAllbyPagination({page, limit, route: 'http://localhost:3000/api/category'});
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findbyId(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findbyId(id);
  }

  @UseGuards(CustomAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(data);
  }

  @UseGuards(CustomAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  update(@Param('id') id: string, @Body() data: CreateCategoryDto): Promise<Category> {
    return this.categoryService.update(id, data);
  }

  @UseGuards(CustomAuthGuard)
  @Delete('/:id')
  delete(@Param('id') id: string): Promise<Category> {
    return this.categoryService.delete(id);
  }
}
