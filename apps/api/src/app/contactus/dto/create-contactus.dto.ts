import { IsNotEmpty, IsString, Matches, MaxLength, MinLength, Validate } from "class-validator";
import { CustomEmails } from "../../shared/isvalidemail";

export class CreateContactusDto {
    // the space at the end is for a space between names
    @Matches(/^[a-zA-Z\u0621-\u064A\u0660-\u0669 ]+$/, {message: 'يجب أن يتكون الإسم من حروف فقط'})
    @MinLength(4, {message: 'يجب أن يكون الإسم أطول من أو يساوي 4 أحرف'})
    @MaxLength(256, {message: 'يجب أن يكون الإسم أقل من 256 أحرف'})
    fullname: string;

    @Validate(CustomEmails, {message: 'يجب أن يكون البريد الإلكتروني gmail أو Outlook'})
    @MinLength(4, {message: 'يجب أن يكون البريد الإلكتروني أطول من أو يساوي 4 أحرف'})
    email: string;

    @Matches(/^[0-9]*$/, {message: 'يجب أن يتكون الهاتف من أرقام فقط'})
    @MinLength(8, {message: 'يجب أن يكون رقم الهاتف أطول من أو يساوي 8 أرقام'})
    phone: string;

    @IsNotEmpty()
    @IsString()
    subject: string;

    @IsNotEmpty()
    @IsString()
    message: string;

    created: Date;
}
