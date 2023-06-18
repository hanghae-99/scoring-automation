import { Script } from 'vm';
import { defaultContext, defaultRunInContextOption } from '../resource/config';

export class JavascriptService {
  public executeJSOnEachArgs = (userCode: string, argsArr: any[][]) => {
    try {
      new Script(userCode);
    } catch (e) {
      if (e instanceof SyntaxError) throw new Error('문법이 정확하지 않습니다');
      throw e;
    }

    return argsArr.map(this.executeJSOnArgs(userCode));
  };

  private executeJSOnArgs = (userCode: string) => (args: any[]) =>
    new Script(`(${userCode}).apply(null, args)`).runInNewContext(
      { ...defaultContext, args },
      defaultRunInContextOption,
    );
}
