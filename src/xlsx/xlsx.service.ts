import { CellValue, Workbook } from 'exceljs';
import { AlgorithmRow, AlgorithmScoredRow } from '../types';

export class XlsxService {
  private readonly scoredColumns: readonly (keyof AlgorithmScoredRow)[] = [
    '타임스탬프',
    '이름',
    '반',
    '언어',
    '1번',
    '2번',
    '3번',
    '문제해설영상',
    '합격여부',
    '틀린문제',
    '점수',
  ] as const;

  async readAnswerSheetToRows(
    file: string,
    sheet: string,
  ): Promise<{ answerRows: AlgorithmRow[]; workBook: Workbook }> {
    const wb = new Workbook();
    await wb.xlsx.readFile(file);

    const s = wb.getWorksheet(sheet);
    const rows = s.getRows(1, s.rowCount);

    if (!rows)
      throw new Error(
        '답안 행을 찾지 못했습니다. 올바른 파일명 및 시트명을 입력했는지 확인해주세요',
      );

    const [columns, ...answerRows] = rows
      .map((r) => r.values as CellValue[])
      .map(([_, ...actual]) => actual);

    const parsed = answerRows.reduce<Record<string, any>[]>((parsed, row) => {
      const rowObj = columns.reduce((rowObj, column, i) => {
        return { ...rowObj, [column as string]: row[i] };
      }, {} as Record<string, any>);

      return !rowObj.이름 ? parsed : [...parsed, rowObj];
    }, []);

    return { answerRows: parsed as AlgorithmRow[], workBook: wb };
  }

  async writeScoreSheetFromRows(
    workBook: Workbook,
    scoredRows: AlgorithmScoredRow[],
    originalXlsxFileName: string,
    scoredSheetName: string = '채점결과',
  ) {
    if (!scoredRows.length) throw new Error('scored rows is empty');

    workBook.getWorksheet(scoredSheetName) &&
      workBook.removeWorksheet(scoredSheetName);
    const ws = workBook.addWorksheet(scoredSheetName);

    const scoredRowsArr = scoredRows.map((scoredRow) =>
      this.scoredColumns.reduce(
        (cellValues, column) => [...cellValues, scoredRow[column]],
        [],
      ),
    );

    ws.addRows([this.scoredColumns, ...scoredRowsArr]);

    return workBook.xlsx.writeFile(originalXlsxFileName);
  }
}
