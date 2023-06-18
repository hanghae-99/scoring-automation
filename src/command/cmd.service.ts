import { Cmd, Run, Transform, UnderCommand } from './cmd.decorator';
import { CommandValidator } from './cmd.validator';
import { XlsxService } from '../xlsx/xlsx.service';
import { ScoreService } from '../score/score.service';
import { algTestCase } from '../score/resource/test_case/algorithm/AlgTestCase';

@UnderCommand
export class CommandService {
  constructor(
    private readonly xlsxService: XlsxService,
    private readonly scoreService: ScoreService,
  ) {}

  @Run
  @Transform(new CommandValidator())
  async run(
    @Cmd('file', 'sheet', 'test')
    cmd: {
      file: string;
      sheet: string;
      test: 'alg' | 'api';
    },
  ) {
    const answerRows = await this.xlsxService.readAnswerSheetToRows(
      cmd.file,
      cmd.sheet,
    );

    if (cmd.test === 'alg') {
      for (const answer of answerRows) {
        const { 주특기, 문제, 이름, 답안: 수강생답안 } = answer;
        const { argsArr, correctAnswers } = algTestCase.questions[문제];

        const result = this.scoreService.score(
          주특기,
          수강생답안,
          argsArr,
          correctAnswers,
        );
        console.log(`${이름}님의 점수는 ${result}점 입니다.`);
      }
    }

    if (cmd.test === 'api') throw new Error('Not implemented yet');
  }
}
