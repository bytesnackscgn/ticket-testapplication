/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { isUUID, isDateString } from './validator';

@ValidatorConstraint({ name: 'uuid', async: false })
export class IsUUID implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return isUUID(value); // for async validations you must return a Promise<boolean> here
  }
  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'value ($value) is not an UUID!';
  }
}

@ValidatorConstraint({ name: 'dateString', async: false })
export class IsDateString implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return isDateString(value); // for async validations you must return a Promise<boolean> here
  }
  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'value ($value) is not an UUID!';
  }
}
