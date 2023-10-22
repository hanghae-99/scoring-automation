import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';

export class JavaService {
  public executeJAVAOnEachArgs(userCode: string, argsArr: any[][]): any[] {
    const className = 'UserSolution'; // 사용자 솔루션 클래스 이름
    const tempSrcFile = `${className}.java`; // 임시 소스 파일 이름

    userCode = userCode.replace(/public class Main/, 'class Main');

    // 사용자의 코드로 자바 파일 생성
    writeFileSync(tempSrcFile, userCode, 'utf-8');

    try {
      // 자바 파일 컴파일
      execSync(`javac ${tempSrcFile}`);

      // 각 테스트 케이스별로 자바 클래스 실행
      return argsArr.map((args, idx) => {
        try {
          // const output = execSync(`java ${className} ${args.join(' ')}`, {
          const output = execSync(`java Main ${args.join(' ')}`, {
            encoding: 'utf-8',
          });
          return JSON.parse(output); // 출력값을 JSON 형태로 변환 (출력값이 JSON 형태여야 함)
        } catch (e: any) {
          console.error(`테스트 케이스 ${idx + 1}에서 오류 발생: ${e.message}`);
          return null; // 또는 기본값 반환
        }
      });
    } catch (e: any) {
      console.error(`컴파일 오류: ${e.message}`);
      return Array(argsArr.length).fill(null); // 모든 테스트 케이스에 대한 null 배열 반환
    } finally {
      // 임시 파일 정리
      unlinkSync(tempSrcFile);
      unlinkSync(`${className}.class`);
    }
  }
}
