import {
  Module,
  ModuleMetadata,
  PipeTransform,
  SetMetadata,
  applyDecorators,
} from '@nestjs/common';
import { COMMAND_MODULE, RUN, TRANSFORM, UNDER_COMMAND } from './cmd.symbol';
import { Command } from 'commander';
import { CommandService } from './cmd.service';

export const CommandModule = ({
  command,
  ...moduleMetadata
}: ModuleMetadata & { command: Command }) => {
  Reflect.defineMetadata(COMMAND_MODULE, command, CommandService);

  return applyDecorators(Module(moduleMetadata));
};
export const Transform = (...validators: PipeTransform[]) =>
  applyDecorators(SetMetadata(TRANSFORM, validators));
export const Run = applyDecorators(SetMetadata(RUN, true));
export const UnderCommand = applyDecorators(SetMetadata(UNDER_COMMAND, true));
export const CommandArgs =
  (...cmdArgs: string[]) =>
  (target: Object, methodName: string | symbol, _parameterIndex: number) => {
    Reflect.defineMetadata(
      target[methodName as keyof typeof target],
      cmdArgs,
      target,
    );
  };
export const Cmd = CommandArgs;
