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
        `${alarmPrefix} 문법 오류: 🙅🏻‍♀️ ${e.message ? e.message : e}`,
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
          `${alarmPrefix} ${i + 1}번 케이스 에러 발생: ${
            e.message
              ? e.message === 'solution is not defined'
                ? '📋 solution 함수가 발견되지 않았습니다.'
                : `🚨 ${e.message}`
              : e
          }`,
        );
      }
    };
}
