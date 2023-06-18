import { PipeTransform, SetMetadata, applyDecorators } from '@nestjs/common';
import { RUN, TRANSFORM, UNDER_COMMAND } from './cmd.symbol';

export const Transform = (...validators: PipeTransform[]) =>
  applyDecorators(SetMetadata(TRANSFORM, validators));
export const Run = applyDecorators(SetMetadata(RUN, true));
export const UnderCommand = applyDecorators(SetMetadata(UNDER_COMMAND, true));
export const Command =
  (...cmdArgs: string[]) =>
  (target: Object, methodName: string | symbol, _parameterIndex: number) => {
    Reflect.defineMetadata(methodName, cmdArgs, target);
  };

export const Cmd = Command;
