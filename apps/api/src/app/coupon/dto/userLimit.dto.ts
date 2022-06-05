import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class UserLimitDto {
  @Type(() => Number)
  @IsInt({ message: 'يجب أن يكون حد المستخدمين رقم موجب'})
  userLimit: number;
}
