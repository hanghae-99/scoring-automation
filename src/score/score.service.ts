import { Injectable } from '@nestjs/common';
import { Specialized } from '../types';
import { JavaService } from './language/java.service';
import { JavascriptService } from './language/js.service';

@Injectable()
export class ScoreService {
  constructor(
    private readonly JSService: JavascriptService,
    private readonly JavaService: JavaService,
  ) {}
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
        ? this.JavaService.executeJAVAOnEachArgs
        : this.JSService.executeJSOnEachArgs;

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
}
