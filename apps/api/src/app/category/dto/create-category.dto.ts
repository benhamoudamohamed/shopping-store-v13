import { Matches, MinLength, MaxLength, IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
    // the space at the end is for a space between names
    @Matches(/^[a-zA-Z\u0621-\u064A\u0660-\u0669 ]+$/, {message: 'يجب أن يتكون الإسم من حروف فقط'})
    @MinLength(4, {message: 'يجب أن يكون الإسم أطول من أو يساوي 4 أحرف'})
    @MaxLength(50, {message: 'يجب أن يكون الإسم أقل من 50 أحرف'})
    name: string;

    @IsNotEmpty()
    fileName: string;

    @IsNotEmpty()
    fileURL: string;

    @IsNotEmpty()
    fileName_low: string;

    @IsNotEmpty()
    fileURL_low: string;
}
