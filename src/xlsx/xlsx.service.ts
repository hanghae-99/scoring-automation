import { CellValue, Workbook } from 'exceljs';
import { Row, ScoredRow } from '../types';

export class XlsxService {
  private readonly scoredColumns: readonly (keyof ScoredRow)[] = [
    '주특기',
    '문제',
    '이름',
    '답안',
    '점수',
  ] as const;

  async readAnswerSheetToRows(
    file: string,
    sheet: string,
  ): Promise<{ answerRows: Row[]; workBook: Workbook }> {
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
        if (!row[i])
          throw new Error(`빈 셀이 존재합니다. 열: ${column}, 행: ${i + 1}`);

        return { ...rowObj, [column as string]: row[i] };
      }, {} as Record<string, any>);

      return [...parsed, rowObj];
    }, []);

    return { answerRows: parsed as Row[], workBook: wb };
  }

  async writeScoreSheetFromRows(
    workBook: Workbook,
    scoredRows: ScoredRow[],
    originalXlsxFileName: string,
    scoredSheetName: string = '채점결과',
  ) {
    if (!scoredRows.length) throw new Error('scored rows is empty');

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
