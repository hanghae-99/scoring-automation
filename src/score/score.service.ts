import { Specialized } from '../types';
import { Script } from 'node:vm';
import { defaultContext, defaultRunInContextOption } from './resource/config';

export class ScoreService {
  public score(
    specialized: Specialized,
    code: string,
    argsArr: any[][],
    answers: any[],
  ) {
    if (
      specialized !== 'NodeJS' &&
      specialized !== 'Spring' &&
      specialized !== 'React'
    )
      throw new Error('주특기를 올바르게 입력해주세요');

    const targetAlgorithm =
      specialized === 'Spring'
        ? this.executeJAVAOnEachArgs
        : this.executeJSOnEachArgs;

    return this.matchResultsWithAnswers(
      targetAlgorithm(code, argsArr),
      answers,
    );
  }

  private matchResultsWithAnswers(results: any[], answers: any[]) {
    const correctAnswers = results.reduce(
      (score, result, i) => (result === answers[i] ? score + 1 : score),
      0,
    );

    return Math.floor((correctAnswers / answers.length) * 100);
  }

  private executeJAVAOnEachArgs = (userCode: string, argsArr: any[][]) =>
    [] as any[];

  private executeJSOnEachArgs = (userCode: string, argsArr: any[][]) => {
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
