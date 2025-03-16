import { ApiPropertyOptions } from '@nestjs/swagger';
import { CamelToSnakeCase } from './utils.types';

export type BaseApiDto<K> = {
  [Property in keyof K as Uppercase<CamelToSnakeCase<string & Property>>]: {
    [Property in keyof Pick<
      ApiPropertyOptions,
      'description' | 'example'
    > as Uppercase<Property>]?: Property extends 'description'
      ? string[] | string
      : string[] | number;
  };
} & {
  [key: string]: {
    [Property in keyof Pick<
      ApiPropertyOptions,
      'description' | 'example'
    > as Uppercase<Property>]?: Property extends 'description'
      ? string[] | string
      : string[] | number;
  };
};
