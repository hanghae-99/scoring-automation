import { Script } from 'vm';
import { defaultContext, defaultRunInContextOption } from '../resource/config';

export class JavascriptService {
  public executeJSOnEachArgs = (userCode: string, argsArr: any[][]) => {
    try {
      new Script(userCode);
    } catch (e) {
      if (e instanceof SyntaxError) {
        console.log(`문법적으로 올바르지 않은 코드: \n${userCode}`);
        throw new Error(`문법이 정확하지 않습니다`);
      }

      throw e;
    }

    return argsArr.map(this.executeJSOnArgs(userCode));
  };

  private executeJSOnArgs = (userCode: string) => (args: any[]) => {
    try {
      return new Script(`${userCode}\n\nsolution(args);`).runInNewContext(
        { ...defaultContext, args },
        defaultRunInContextOption,
      );
    } catch (e) {
      if (e instanceof ReferenceError) {
        console.log(
          `solution 함수가 발견되지 않았습니다. 함수명을 solution으로 제출해주세요. 작성된 코드: ${userCode}`,
        );
      }

      return e;
    }
  };
}
