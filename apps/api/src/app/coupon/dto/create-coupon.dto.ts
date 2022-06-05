import { Type } from "class-transformer";
import { MinLength, MaxLength, IsNotEmpty, IsInt } from "class-validator";

export class CreateCouponDto {
  @MinLength(4, {message: 'يجب أن يكون رمز الكوبون أطول من أو يساوي 4 أحرف'})
  @MaxLength(6, {message: 'يجب أن يكون رمز الكوبون أقل من 7 أحرف'})
  code: string;

  @Type(() => Number)
  @IsInt({ message: 'يجب أن يكون التخفيض رقم موجب'})
  discount: number;

  @Type(() => Number)
  @IsInt({ message: 'يجب أن يكون حد المستخدمين رقم موجب'})
  userLimit: number;

  @IsNotEmpty()
  expired: boolean;
}
