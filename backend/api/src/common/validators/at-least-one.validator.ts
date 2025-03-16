import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'AtLeastOneField', async: false })
class AtLeastOneFieldConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const object = args.object as any;
    const propertyNames = args.constraints[0];
    return propertyNames.some((propertyName: string) => {
      const value = object[propertyName];
      return value !== undefined && value.length > 0;
    });
  }

  defaultMessage(args: ValidationArguments) {
    const propertyNames = args.constraints[0];
    return `At least one of the following fields must be provided: ${propertyNames.join(', ')}`;
  }
}

export function AtLeastOneField(
  propertyNames: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [propertyNames],
      validator: AtLeastOneFieldConstraint,
    });
  };
}
