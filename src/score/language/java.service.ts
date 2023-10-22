import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';

export class JavaService {
  public executeJAVAOnEachArgs(userCode: string, argsArr: any[][]): any[] {
    const tempSrcFile = `UserSolution.java`; // 임시 소스 파일 이름

    // 사용자의 메인 클래스 이름을 가져옵니다.
    const classNameMatch = userCode.match(/public class (\w+)/);
    if (!classNameMatch) {
      console.error('유효한 Java 클래스를 찾을 수 없습니다.');
      return Array(argsArr.length).fill(null);
    }

    const originalClassName = classNameMatch[1];
    // 원래 클래스 이름을 UserSolution으로 모두 교체합니다.
    userCode = userCode.replace(
      new RegExp(originalClassName, 'g'),
      'UserSolution',
    );
    // 수정된 사용자 코드로 임시 Java 파일을 생성합니다.
    writeFileSync(tempSrcFile, userCode, 'utf-8');

    try {
      // 임시 Java 파일을 컴파일합니다.
      execSync(`javac ${tempSrcFile}`);

      // 각 테스트 케이스에 대해 Java 클래스를 실행합니다.
      return argsArr.map((args, idx) => {
        try {
          const output = execSync(`java UserSolution ${args.join(' ')}`, {
            encoding: 'utf-8',
          });
          return JSON.parse(output); // 출력값을 JSON 형태로 변환 (출력값이 JSON 형태여야 함)
        } catch (e: any) {
          console.error(`테스트 케이스 ${idx + 1}에서 오류 발생: ${e.message}`);
          return null;
        }
      });
    } catch (e: any) {
      console.error(`컴파일 오류: ${e.message}`);
      return Array(argsArr.length).fill(null);
    } finally {
      // 임시 파일들을 제거합니다.
      unlinkSync(tempSrcFile);
      unlinkSync('UserSolution.class');
    }
  }
}
