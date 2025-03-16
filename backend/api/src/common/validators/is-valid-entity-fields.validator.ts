import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsValidEntityFields', async: false })
class EntityFieldsConstraint implements ValidatorConstraintInterface {
  validate(fields: string[], args: ValidationArguments) {
    const validFields = args.constraints[0];
    return fields.every((field) => validFields.includes(field));
  }

  defaultMessage(args: ValidationArguments) {
    return `Provided query fields: (${args.value}) are not valid`;
  }
}

export function IsValidEntityFields(
  validFields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validFields],
      validator: EntityFieldsConstraint,
    });
  };
}
