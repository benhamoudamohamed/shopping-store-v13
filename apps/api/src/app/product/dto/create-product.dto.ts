import { Matches, MinLength, MaxLength, IsString, IsNotEmpty } from "class-validator";
import { Category } from "../../category/entities/category.entity";

export class CreateProductDto {
  // the space at the end is for a space between names
  @Matches(/^[a-zA-Z\u0621-\u064A\u0660-\u0669 ]+$/, {message: 'يجب أن يتكون الإسم من حروف فقط'})
  @MinLength(4, {message: 'يجب أن يكون الإسم أطول من أو يساوي 4 أحرف'})
  @MaxLength(50, {message: 'يجب أن يكون الإسم أقل من 50 أحرف'})
  name: string;

  @IsString()
  @MinLength(6, {message: 'يجب أن يكون كود المنتج أطول من أو يساوي 6 أحرف'})
  @MaxLength(8, {message: 'يجب أن يكون كود المنتج أقل أو يساوي من 8 أحرف'})
  productCode: string;

  @Matches(/^[+]?\d+([.]\d+)?$/, { message: 'يجب أن يكون السعر رقم موجب'})
  price: string;

  @IsNotEmpty()
  isFavorite: boolean;

  @IsNotEmpty()
  isAvailable: boolean;

  @IsNotEmpty()
  fileName: string;

  @IsNotEmpty()
  fileURL: string;

  @IsNotEmpty()
  fileName_low: string;

  @IsNotEmpty()
  fileURL_low: string;

  category: Category;
}
