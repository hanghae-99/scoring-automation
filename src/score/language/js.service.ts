import { Script } from 'node:vm';
import { defaultContext, defaultRunInContextOption } from '../resource/config';

export class JavascriptService {
  public executeJSOnEachArgs = (
    userCode: string,
    argsArr: any[][],
    answerIdx: number,
    questionIdx: number,
  ) => {
    const alarmPrefix = `${answerIdx + 1}번 제출답안 ${questionIdx + 1}번 문제`;
    try {
      new Script(userCode);
    } catch (e: any) {
      console.error(
        `🙅🏻‍♀️ ${alarmPrefix} 문법 오류: ${e.message ? e.message : e}`,
      );
    }

    return argsArr.map(this.executeJSOnArgs(userCode, alarmPrefix));
  };

  private executeJSOnArgs =
    (userCode: string, alarmPrefix: string) => (args: any[], i: number) => {
      try {
        return new Script(`${userCode};\nsolution(...args);`).runInNewContext(
          { ...defaultContext, args: JSON.parse(JSON.stringify(args)) },
          defaultRunInContextOption,
        );
      } catch (e: any) {
        console.error(
          `🚨 ${alarmPrefix} ${i + 1}번 케이스 에러 발생: ${
            e.message
              ? e.message.includes('solution is not defined')
                ? 'solution 함수가 발견되지 않았습니다.'
                : e.message.includes('Unexpected end of input')
                ? '코드가 완성되지 않았습니다. 괄호 등을 확인해주세요'
                : e.message.includes('Unexpected token')
                ? '코드에 문법 오류가 있습니다. export등 유효하지 않은 토큰을 확인해주세요'
                : e.message.includes('Maximum call stack size exceeded')
                ? '코드가 무한루프에 빠졌을 가능성이 높습니다. 코드를 확인해주세요'
                : e.message
              : e
          }`,
        );
      }
    };
}
