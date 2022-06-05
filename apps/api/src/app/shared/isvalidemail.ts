import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class CustomEmails implements ValidatorConstraintInterface {
  validate(text: string) {
    return text.includes("@outlook.com") || text.includes("@outlook.fr") || text.includes("@gmail.com");
  }
}
