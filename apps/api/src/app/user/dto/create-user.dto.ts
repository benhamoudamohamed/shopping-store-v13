import { UserRole } from "@shoppingstore/api-interfaces";
import { Matches, MaxLength, MinLength, Validate } from "class-validator";
import { CustomEmails } from "../../shared/isvalidemail";

export class CreateUserDto {
    // the space at the end is for a space between names
    @Matches(/^[a-zA-Z\u0621-\u064A\u0660-\u0669 ]+$/, {message: 'يجب أن يتكون الإسم من حروف فقط'})
    @MinLength(4, {message: 'يجب أن يكون الإسم أطول من أو يساوي 4 أحرف'})
    @MaxLength(256, {message: 'يجب أن يكون الإسم أقل من 256 أحرف'})
    fullname: string;

    @Validate(CustomEmails, {message: 'يجب أن يكون البريد الإلكتروني gmail أو Outlook'})
    @MinLength(4, {message: 'يجب أن يكون البريد الإلكتروني أطول من أو يساوي 4 أحرف'})
    email: string;

    @MinLength(8, {message: 'يجب أن تكون كلمة المرور أطول من أو يساوي 8 أحرف'})
    @MaxLength(20, {message: 'يجب أن تكون كلمة المرور أقل من 20 أحرف'})
    @Matches(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'يجب أن تتكون كلمة المرور:  حروف مثل A، حروف مثل a، حروف مثل ! وأرقام'})
    password: string;

    userRole: UserRole;

    created: Date;
}
