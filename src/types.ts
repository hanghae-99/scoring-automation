export type Language = 'java' | 'javascript';
type Scored = {
  합격여부: boolean;
  틀린문제: string;
  점수: number;
};
export type AlgorithmRow = {
  타임스탬프: string;
  이름: string;
  반: string;
  언어: Language;
  문제선택: string;
  문제해설영상: string;
  '1번 문제': string;
  '2번 문제': string;
  '3번 문제': string;
};

export type AlgorithmScoredRow = AlgorithmRow & Scored;
export type ApiRow = {
  이름: string;
  반: string;
  url: string;
};
export type ApiScoredRow = ApiRow & {
  점수: number;
  감점요인: string;
};
export type AlgorithmColumnNames = keyof AlgorithmRow;
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
