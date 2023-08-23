import { Injectable } from '@nestjs/common';
import { Language } from '../types';
import { JavaService } from './language/java.service';
import { JavascriptService } from './language/js.service';
import axios from 'axios';
import { URL } from 'node:url';
import { ApiService } from './api/api.service';

@Injectable()
export class ScoreService {
  constructor(
    private readonly JSService: JavascriptService,
    private readonly JavaService: JavaService,
    private readonly apiService: ApiService,
  ) {
    axios.defaults.timeout = 5000;
  }
  public scoreAlgorithm(
    language: Language,
    code: string,
    argsArr: any[][],
    answers: any[],
    answerIdx: number,
    questionIdx: number,
  ) {
    if (language !== 'Java' && language !== 'JavaScript')
      throw new Error('주특기를 올바르게 입력해주세요');

    const targetAlgorithm =
      language === 'Java'
        ? this.JavaService.executeJAVAOnEachArgs
        : this.JSService.executeJSOnEachArgs;

    return this.matchResultsWithAnswers(
      targetAlgorithm(code, argsArr, answerIdx, questionIdx),
      answers,
    );
  }

  public async scoreApi(url: string, startPoint: number = 10) {
    try {
      const validation = new URL(url);
      if (validation.protocol !== 'http:')
        throw new Error(
          `허용되지 않은 프로토콜(${validation.protocol})\n시험용 프로토콜은 http만 허용됩니다`,
        );
    } catch (e) {
      return {
        score: 0,
        reductionReasons: `올바른 URL이 아닙니다: ${
          e instanceof Error ? e.message : e
        } (10점 감점)`,
      };
    }

    const { targetUserId, allUsersPointToReduce, allUsersReductionReasons } =
      await this.apiService.getPointToReduceAndTargetUserIdIfExistsOfGetAllUsersApi(
        url,
      );

    const { targetUserPointToReduce, targetUserReductionReasons } =
      await this.apiService.getPointToReduceOfTargetUserApi(url, targetUserId);

    const {
      exceptionHandlingPointToReduce,
      exceptionHandlingReductionReasons,
    } = await this.apiService.getPointToReduceOfExceptionHandling(url);

    return {
      score:
        startPoint -
        (allUsersPointToReduce +
          targetUserPointToReduce +
          exceptionHandlingPointToReduce),
      reductionReasons: allUsersReductionReasons
        .concat(targetUserReductionReasons)
        .concat(exceptionHandlingReductionReasons)
        .join('\n'),
    };
  }

  private matchResultsWithAnswers(results: any[], answers: any[]) {
    const correctAnswers = results.reduce(
      (score, result, i) => (result === answers[i] ? score + 1 : score),
      0,
    );

    return Math.floor((correctAnswers / answers.length) * 100);
  }
}
