export type Specialized = 'Spring' | 'React' | 'NodeJS';
export type Row = {
  주특기: Specialized;
  문제: string;
  이름: string;
  답안: string;
};
export type ScoredRow = Row & {
  점수: number;
};
export type ColumnNames = keyof Row;
export type AlgorithmOption = {
  delete: boolean;
  file: string;
  sheet: string;
  test: 'alg' | 'api';
};
export type OptionWithoutKind = Omit<AlgorithmOption, 'test'>;
export type APIMetadata = {
  path: string;
  requestBody: Record<string, any>;
  expectedResponse: any;
  HttpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
};
