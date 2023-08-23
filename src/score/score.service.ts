import { Injectable } from '@nestjs/common';
import { Language } from '../types';
import { JavaService } from './language/java.service';
import { JavascriptService } from './language/js.service';
import axios from 'axios';
import { URL } from 'node:url';
import { ApiService } from './api/api.service';
import { AssertionError, deepEqual } from 'node:assert';

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
      answerIdx,
      questionIdx,
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

  private matchResultsWithAnswers(
    results: any[],
    answers: any[],
    answerIdx: number,
    questionIdx: number,
  ) {
    const correctAnswers = results.reduce((score, result, i) => {
      try {
        deepEqual(result, answers[i]);
        return score + 1;
      } catch (e) {
        if (!(e instanceof AssertionError)) console.error(e);
        else
          console.log(
            `❌ ${answerIdx + 1}번 제출 답안 ${questionIdx + 1}번 문제 ${
              i + 1
            }번 케이스 오답: ${JSON.stringify(result)} !== ${JSON.stringify(
              answers[i],
            )}`,
          );
        return score;
      }
    }, 0);

    return Math.floor((correctAnswers / answers.length) * 100);
  }
}
