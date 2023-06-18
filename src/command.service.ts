import {
  Injectable,
  OnModuleInit,
  PipeTransform,
  SetMetadata,
  applyDecorators,
} from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import 'reflect-metadata';

const RUN = Symbol('RUN');
const UNDER_COMMAND = Symbol('UNDER_COMMAND');
const TRANSFORM = Symbol('TRANSFORM');

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

@Injectable()
export class CommandService implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly scanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.discoveryService
      .getProviders()
      .filter(
        (wrapper) =>
          wrapper.isDependencyTreeStatic() &&
          wrapper.metatype &&
          this.reflector.get(UNDER_COMMAND, wrapper.metatype),
      )
      .forEach(({ instance }) => {
        this.scanner
          .getAllMethodNames(Object.getPrototypeOf(instance))
          .forEach((methodName) => {
            const isRun = this.reflector.get(RUN, instance[methodName]);

            if (isRun) {
              const transforms = this.reflector.get(
                TRANSFORM,
                instance[methodName],
              );

              // replace with commander opts
              const originalArgs = { file: 'example.xlsx', sheet: 'Sheet1' };
              const parsedArgs: any = transforms.length
                ? transforms.reduce(
                    (_: any, transform: PipeTransform) =>
                      transform.transform(originalArgs, {
                        type: 'custom',
                      }),

                    originalArgs,
                  )
                : originalArgs;

              const cmdArgs = this.reflector.get(methodName, instance);

              // validator와 상관없이 개발자가 입력한 인자들만 받을 수 있도록한다
              const constructedArgs = cmdArgs.reduce(
                (cmdObj: any, cmdArg: string) => {
                  cmdObj[cmdArg] = parsedArgs[cmdArg];

                  return cmdObj;
                },
                {},
              );

              instance[methodName](constructedArgs);
            }
          });
      });
  }
}
