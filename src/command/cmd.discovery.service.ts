import { Injectable, OnModuleInit, PipeTransform } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { RUN, TRANSFORM, UNDER_COMMAND } from './cmd.symbol';
import { CLI_OPTIONS } from './cmd.options';
import 'reflect-metadata';

@Injectable()
export class CommandDiscoveryService implements OnModuleInit {
  private readonly PARSED_OPTS = CLI_OPTIONS;

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

              const parsedArgs: any = transforms.length
                ? transforms.reduce(
                    (_: any, transform: PipeTransform) =>
                      transform.transform(this.PARSED_OPTS, {
                        type: 'custom',
                      }),

                    this.PARSED_OPTS,
                  )
                : this.PARSED_OPTS;

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
