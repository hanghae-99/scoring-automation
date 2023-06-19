import { PipeTransform } from '@nestjs/common';

export class ArgumentsValidator implements PipeTransform {
  transform(value: any) {
    if (!value.file || !value.sheet || !['alg', 'api'].includes(value.test))
      throw new Error('Invalid arguments');
    return value;
  }
}
