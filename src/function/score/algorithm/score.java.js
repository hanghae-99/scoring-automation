import { exec } from "node:child_process";
import { promisify } from "node:util";

const promisifiedExec = promisify(exec);
/**
 * @todo nodejs처럼 텍스트를 기반으로 실행하는 방법은 없는지 찾아보기
 * base java program안에서 java 소스코드를 읽고, 평가하고, 그것을 stdout으로 내보내면 node가 결과 받기 훨씬 쉬울듯?
 * @todo 아니면 자바 프로그램은 그냥 json파일 경로를 함께 문자열로 코드와 합쳐서 실행하는 것이 더 쉬울지도
 */
export function executeJAVAOnEachArgs(filePath, argsArr) {
  /**
   * @todo argsArr을 java program에 넘겨주기
   * @todo java 프로그램의 결괏값을 stdout으로 출력하도록 하는 사전작업 필요
   *
   */

  const command = args.reduce(
    (cmd, arg) => `${cmd} ${arg}`,
    `javac ${userCode} && java ${userCode.split(".")[0]}`
  );
  const execMapped = argsArr.map((args) => promisifiedExec(command));

  return Promise.allSettled(execMapped);
}
