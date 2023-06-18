import { PipeTransform } from '@nestjs/common';

export class CommandValidator implements PipeTransform {
  transform(value: any) {
    if (!value.file || !value.sheet || !['alg', 'api'].includes(value.test))
      throw new Error('Invalid arguments');
    return value;
  }
}
