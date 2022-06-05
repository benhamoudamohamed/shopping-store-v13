import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, UseGuards, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { CustomAuthGuard } from '../shared/auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findbyId(@Param('id') id: string): Promise<Product> {
    return this.productService.findbyId(id);
  }

  @Get('isFavorite/:isFavorite')
  findByFavorite(@Param('isFavorite') isFavorite: boolean) {
    return this.productService.findByFavorite(isFavorite);
  }

  @UseGuards(CustomAuthGuard)
  @Post('category/:catID')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: CreateProductDto, @Param('catID') catID: string): Promise<Product> {
    return this.productService.create(data, catID);
  }

  @UseGuards(CustomAuthGuard)
  @Put(':id/category/:catID')
  @HttpCode(HttpStatus.CREATED)
  update(@Param('id') id: string, @Param('catID') catID: string, @Body() data: CreateProductDto): Promise<Product> {
    return this.productService.update(id, data, catID);
  }

  @UseGuards(CustomAuthGuard)
  @Delete('/:id')
  delete(@Param('id') id: string): Promise<Product> {
    return this.productService.delete(id);
  }
}
