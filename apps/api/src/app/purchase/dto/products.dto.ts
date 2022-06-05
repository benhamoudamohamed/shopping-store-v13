import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class ProductDTO {

  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  image: string;

  @Type(() => Number)
  @IsInt({ message: 'يجب أن يكون السعر رقم موجب'})
  price: number;

  @Type(() => Number)
  @IsInt({ message: 'يجب أن تكون الكمية رقم موجب'})
  quantity: number;

  @Type(() => Number)
  @IsInt({ message: 'يجب أن تكون التكلفة رقم موجب'})
  cost: number;
}
