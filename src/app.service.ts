import { Cmd, Run, Transform, UnderCommand } from './command/cmd.decorator';
import { ArgumentsValidator } from './validator/args.validator';
import { XlsxService } from './xlsx/xlsx.service';
import { ScoreService } from './score/score.service';
import { algTestCase } from './score/resource/test_case/algorithm/AlgTestCase';
import { ScoredRow } from './types';

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

    if (cmd.test === 'alg') {
      const scoredRows: ScoredRow[] = answerRows.map((answerRow) => {
        const { 주특기, 문제, 답안: 수강생답안 } = answerRow;
        const { argsArr, correctAnswers } = algTestCase.questions[문제];

        const 점수 = this.scoreService.score(
          주특기,
          수강생답안,
          argsArr,
          correctAnswers,
        );

        return { ...answerRow, 점수 };
      });

      await this.xlsxService.writeScoreSheetFromRows(
        workBook,
        scoredRows,
        cmd.file,
        '채점결과시트',
      );
    }

    if (cmd.test === 'api') throw new Error('Not implemented yet');
  }
}
