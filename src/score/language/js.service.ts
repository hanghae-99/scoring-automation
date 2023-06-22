import { Script } from 'vm';
import { defaultContext, defaultRunInContextOption } from '../resource/config';

export class JavascriptService {
  public executeJSOnEachArgs = (userCode: string, argsArr: any[][]) => {
    try {
      new Script(userCode);
    } catch (e) {
      if (e instanceof SyntaxError)
        throw new Error(
          `문법이 정확하지 않습니다: 유저가 작성한 코드: ${userCode}`,
        );
      throw e;
    }

    return argsArr.map(this.executeJSOnArgs(userCode));
  };

  private executeJSOnArgs = (userCode: string) => (args: any[]) => {
    try {
      return new Script(`(${userCode}).apply(null, args)`).runInNewContext(
        { ...defaultContext, args },
        defaultRunInContextOption,
      );
    } catch (e) {
      return e;
    }
  };
}
