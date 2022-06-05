import { Matches, MaxLength, MinLength } from "class-validator";

export class AuthDto {
  email: string;

  @MinLength(8, {message: 'يجب أن تكون كلمة المرور أطول من أو يساوي 8 أحرف'})
  @MaxLength(20, {message: 'يجب أن تكون كلمة المرور أقل من 20 أحرف'})
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'يجب أن تتكون كلمة المرور:  حروف مثل A، حروف مثل a، حروف مثل ! وأرقام'})
  password: string;
}
