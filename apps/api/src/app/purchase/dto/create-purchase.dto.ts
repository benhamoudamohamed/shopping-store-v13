import { Type } from "class-transformer";
import { Matches, IsNotEmpty, Validate, MinLength, IsInt } from "class-validator";
import { CustomEmails } from "../../shared/isvalidemail";
import { ProductDTO } from "./products.dto";

export class CreatePurchaseDto {

  items: ProductDTO[]

  @Type(() => Number)
  @IsInt({ message: 'يجب أن يكون المجموع الفرعي رقم موجب'})
  subtotal: number;

  coupon: string;

  @Type(() => Number)
  @IsInt({ message: 'يجب أن يكون التخفيض رقم موجب'})
  discount: number;

  @Type(() => Number)
  @IsInt({ message: 'يجب أن يكون المبلغ الإجمالي رقم موجب'})
  grandTotal: number;

  @IsNotEmpty()
  clientName: string;

  @Validate(CustomEmails, {message: 'يجب أن يكون البريد الإلكتروني gmail أو Outlook'})
  @MinLength(4, {message: 'يجب أن يكون البريد الإلكتروني أطول من أو يساوي 4 أحرف'})
  email: string;

  @Matches(/^[0-9]*$/, {message: 'يجب أن يتكون الهاتف من أرقام فقط'})
  @MinLength(8, {message: 'يجب أن يكون رقم الهاتف أطول من أو يساوي 8 أرقام'})
  phone: string;

  @IsNotEmpty()
  address: string;

  created: Date;
}
