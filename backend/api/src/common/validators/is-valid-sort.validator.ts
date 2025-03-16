import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

/**
 * Validator to ensure the sort string is in the correct format and contains valid field names.
 */
@ValidatorConstraint({ name: 'isValidSort', async: false })
class IsValidSortConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'string') return false;
    const validFields = args.constraints[0];
    const sortFields = value.split(',');
    return sortFields.every((field) => {
      const [fieldName, order] = field.split(':');
      return (
        validFields.includes(fieldName) && (order === 'ASC' || order === 'DESC')
      );
    });
  }

  defaultMessage(args: ValidationArguments) {
    return 'Sort string contains invalid field names or format';
  }
}

/**
 * Decorator to apply the sort validation.
 */
export function IsValidSort(
  validFields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validFields],
      validator: IsValidSortConstraint,
    });
  };
}
