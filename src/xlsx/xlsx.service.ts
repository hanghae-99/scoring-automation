import { Workbook } from 'exceljs';
import {
  AlgorithmRow,
  AlgorithmScoredRow,
  ApiRow,
  ApiScoredRow,
} from '../types';

export class XlsxService {
  private readonly scoredApiColumns: readonly (keyof ApiScoredRow)[] = [
    '이름',
    '반',
    'url',
    '점수',
    '감점요인',
  ] as const;
  private readonly algorithmColumns: readonly (keyof AlgorithmRow)[] = [
    '이름',
    '언어',
    '1번 문제',
    '2번 문제',
    '3번 문제',
  ];
  private readonly scoredAlgorithmColumns: readonly (keyof AlgorithmScoredRow)[] =
    [...this.algorithmColumns, '합격여부', '틀린문제', '점수'] as const;

  isAlgorithmRows(rows: any[]): rows is AlgorithmRow[] {
    return !!rows[0].언어;
  }

  async readAnswerSheetToRows(
    file: string,
    sheet: string,
  ): Promise<{ answerRows: AlgorithmRow[] | ApiRow[]; workBook: Workbook }> {
    const wb = new Workbook();
    await wb.xlsx.readFile(file);

    const s = wb.getWorksheet(sheet);
    const rows = s.getRows(1, s.rowCount);

    if (!rows)
      throw new Error(
        '답안 행을 찾지 못했습니다. 올바른 파일명 및 시트명을 입력했는지 확인해주세요',
      );

    const [columns, ...answerRows] = rows
      .map((r) =>
        (r.values as any[]).map((v) =>
          v.text
            ? v.text
            : v.richText
            ? v.richText.map(({ text }: any) => text).join('')
            : v,
        ),
      )
      .map(([_, ...actual]) => actual);

    this.algorithmColumns.forEach((col) => {
      if (!columns.includes(col))
        throw new Error(`답안에 ${col} 열이 없습니다`);
    });

    const parsed = answerRows.reduce<Record<string, any>[]>((parsed, row) => {
      const rowObj = columns.reduce((rowObj, column, i) => {
        return { ...rowObj, [column as string]: row[i] };
      }, {} as Record<string, any>);

      return !rowObj.이름 ? parsed : [...parsed, rowObj];
    }, []);

    return { answerRows: parsed as AlgorithmRow[] | ApiRow[], workBook: wb };
  }

  async writeScoreSheetFromRows(
    workBook: Workbook,
    scoredRows: AlgorithmScoredRow[] | ApiScoredRow[],
    originalXlsxFileName: string,
    scoredSheetName: string = '채점결과',
  ) {
    if (!scoredRows.length) throw new Error('scored rows is empty');

    workBook.getWorksheet(scoredSheetName) &&
      workBook.removeWorksheet(scoredSheetName);
    const ws = workBook.addWorksheet(scoredSheetName);

    const scoredRowsArr = this.isAlgorithmRows(scoredRows)
      ? scoredRows.map((scoredRow) =>
          this.scoredAlgorithmColumns.reduce(
            (cellValues, column) => [...cellValues, scoredRow[column]],
            [],
          ),
        )
      : scoredRows.map((scoredRow) =>
          this.scoredApiColumns.reduce(
            (cellValues, column) => [...cellValues, scoredRow[column]],
            [],
          ),
        );

    const targetColumns = this.isAlgorithmRows(scoredRows)
      ? this.scoredAlgorithmColumns
      : this.scoredApiColumns;

    ws.addRows([targetColumns, ...scoredRowsArr]);

    return workBook.xlsx.writeFile(originalXlsxFileName);
  }
}
