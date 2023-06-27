import { Cmd, Run, Transform, UnderCommand } from './command/cmd.decorator';
import { ArgumentsValidator } from './validator/args.validator';
import { XlsxService } from './xlsx/xlsx.service';
import { ScoreService } from './score/score.service';
import { algTestCase } from './score/resource/test_case/algorithm/AlgTestCase';
import { AlgorithmScoredRow, ApiRow, ApiScoredRow } from './types';

@UnderCommand
export class AppService {
  constructor(
    private readonly xlsxService: XlsxService,
    private readonly scoreService: ScoreService,
  ) {}

  @Run
  @Transform(new ArgumentsValidator())
  async run(
    @Cmd('file', 'sheet', 'test')
    cmd: {
      file: string;
      sheet: string;
      test: 'alg' | 'api';
    },
  ) {
    const { answerRows, workBook } =
      await this.xlsxService.readAnswerSheetToRows(cmd.file, cmd.sheet);

    if (cmd.test === 'alg' && this.xlsxService.isAlgorithmRows(answerRows)) {
      const scoredRows: AlgorithmScoredRow[] = answerRows.map((answerRow) => {
        const { 언어 } = answerRow;

        const scoreAndFailReason = (['1번', '2번', '3번'] as const).reduce(
          (scoreAndFailReason, question) => {
            const { argsArr, correctAnswers, point } = algTestCase[question];
            const 답안 = answerRow[question];

            if (!언어 || !답안) return scoreAndFailReason;

            const score = this.scoreService.scoreAlgorithm(
              언어,
              답안.replace(/&apos;/g, "'"),
              argsArr,
              correctAnswers,
            );

            score === 100
              ? (scoreAndFailReason.totalScore += point)
              : scoreAndFailReason.틀린문제.push({
                  문제: question,
                  점수: score,
                });

            return scoreAndFailReason;
          },
          {
            totalScore: 0,
            틀린문제: [],
          },
        );

        return {
          ...answerRow,
          점수: scoreAndFailReason.totalScore,
          합격여부: scoreAndFailReason.totalScore >= 3,
          틀린문제: scoreAndFailReason.틀린문제
            .map((fq) => `문제: ${fq.문제}\n점수: ${fq.점수}`)
            .join('\n\n'),
        };
      });

      await this.xlsxService.writeScoreSheetFromRows(
        workBook,
        scoredRows,
        cmd.file,
        '채점결과시트',
      );
    }

    if (cmd.test === 'api' && !this.xlsxService.isAlgorithmRows(answerRows)) {
      const scoreAndFailReasons = await Promise.all(
        answerRows.map((apiRow) => this.scoreService.scoreApi(apiRow.url)),
      );

      const scoredRows: ApiScoredRow[] = answerRows.map((apiRow, i) => ({
        ...apiRow,
        점수: scoreAndFailReasons[i].score,
        감점요인: scoreAndFailReasons[i].reductionReasons,
      }));

      await this.xlsxService.writeScoreSheetFromRows(
        workBook,
        scoredRows,
        cmd.file,
        '채점결과시트',
      );
    }
  }
}
