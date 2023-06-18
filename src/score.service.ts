import { PipeTransform } from '@nestjs/common';
import { Cmd, Run, UnderCommand, Transform } from './command.service';

class Validator implements PipeTransform {
  transform(value: any) {
    if (!value.file || !value.sheet) throw new Error('Invalid arguments');
    return value;
  }
}

@UnderCommand
export class ScoreService {
  @Run
  @Transform(new Validator())
  getHello(@Cmd('file', 'sheet') cmd: { file: string; sheet: string }) {
    console.log({ cmd });
  }
}
