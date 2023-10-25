import { execSync, spawnSync } from 'child_process';
import { unlinkSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { templateMap } from './java.templates';

type SimpleType = number | string | boolean;
type ArgumentType = SimpleType[] | SimpleType[][];

export class JavaService {
  private static extractSolutionMethod(userCode: string): string {
    const jarPath = join(
      dirname(__filename),
      'libs',
      'MethodExtractor-1.0-SNAPSHOT.jar',
    );
    const command = `echo "${userCode}" | java -jar ${jarPath}`;
    const output = execSync(command, { encoding: 'utf-8' }).trim();
    if (!output) {
      throw new Error('Failed to extract the solution method.');
    }

    return output;
  }

  private static extractMethodInfoUsingAST(userCode: string): string {
    try {
      const jarPath = join(
        dirname(__filename),
        'libs',
        'ASTAnalyzer-1.0-SNAPSHOT.jar',
      );
      console.log(`usercode given to ASTAnalyzer: ${userCode}`);
      const command = `echo "${userCode}" | java -jar ${jarPath}`;
      const output = execSync(command, { encoding: 'utf-8' }).trim();
      // const jarPath = join(
      //   dirname(__filename),
      //   'libs',
      //   'ASTAnalyzer-1.0-SNAPSHOT.jar',
      // );
      //
      // // 임시 파일에 사용자 코드 작성
      // const tempFilePath = join(__dirname, 'temp.java');
      // writeFileSync(tempFilePath, userCode, 'utf-8');
      //
      // // Java 응용 프로그램에 임시 파일 경로를 전달
      // const command = `java -jar ${jarPath} ${tempFilePath}`;
      // const output = execSync(command, { encoding: 'utf-8' }).trim();
      // 임시 파일 삭제
      // unlinkSync(tempFilePath);

      if (!output) {
        throw new Error('Failed to extract method info.');
      }

      return output;
    } catch (error) {
      console.error(
        'An error occurred while extracting method info using AST:',
        error,
      );
      throw error;
    }
  }

  private static integrateUserCodeWithTemplate(
    userCode: string,
    templateCode: string,
  ): string {
    const solutionMethodBody = this.extractSolutionMethod(userCode);
    return templateCode.replace('PLACEHOLDER', solutionMethodBody);
  }

  public executeJAVAOnEachArgs(
    userCode: string,
    argsArr: any[],
    answerIdx: number,
    questionIdx: number,
  ): any[] {
    // userCode 내부를 확인해서, parameters 와 return type 의 명세에 따라 templateType 을 결정한다.
    let methodInfo;
    let templateCode;
    try {
      // userCode 내부를 확인해서, parameters 와 return type 의 명세에 따라 templateType 을 결정한다.
      methodInfo = JavaService.extractMethodInfoUsingAST(userCode);
    } catch (e: any) {
      const errorMessage = `Error extracting method info: ${e.message} `;
      console.error(
        `$🚨 ${errorMessage} at answerIdx: ${answerIdx}, questionIdx: ${questionIdx} \n userCode: ${userCode} \n argsArr: ${argsArr}`,
      );
      // 첫 요소에는 errorMessage 를 넣어서 반환한다.
      return Array(argsArr.length).fill(errorMessage, 0, 1);
    }

    if (!methodInfo.includes('Return type')) {
      // 첫 요소에는 invalid 한 methodInfo 를 넣어서 반환한다.
      return Array(argsArr.length).fill(methodInfo, 0, 1);
    }

    try {
      templateCode = JavaService.getTemplate(methodInfo);
    } catch (e: any) {
      const errorMessage = `Error getting template: ${e.message}`;
      console.error(
        `️🚨 ${errorMessage} at answerIdx: ${answerIdx}, questionIdx: ${questionIdx} \n userCode: ${userCode} \n argsArr: ${argsArr}`,
      );
      return Array(argsArr.length).fill(errorMessage, 0, 1);
    }

    const integratedCode = JavaService.integrateUserCodeWithTemplate(
      userCode,
      templateCode,
    );

    const tempSrcFile = 'UserSolution.java';
    writeFileSync(tempSrcFile, integratedCode, 'utf-8');

    try {
      const jarPath = join(dirname(__filename), 'libs', 'gson-2.8.8.jar');
      execSync(`javac -cp ${jarPath} UserSolution.java`);
      return argsArr.map((args, idx) => {
        try {
          const jsonInput = JSON.stringify(args);

          const jarPath = join(dirname(__filename), 'libs', 'gson-2.8.8.jar');

          // Use spawnSync instead of execSync to better handle both stdout and stderr
          const child = spawnSync(
            'java',
            ['-cp', `.:${jarPath}`, 'UserSolution', jsonInput],
            {
              encoding: 'utf-8',
            },
          );

          const stdout = child.stdout.trim(); // This contains your actual result
          const stderr = child.stderr.trim(); // This contains the logs from System.err.println

          return JSON.parse(stdout);
        } catch (e: any) {
          console.error(`테스트 케이스 ${idx + 1}에서 오류 발생: ${e.message}`);
          return null;
        }
      });
    } catch (e: any) {
      console.error(`컴파일 오류: ${e.message}`);
      return Array(argsArr.length).fill(null);
    } finally {
      unlinkSync('UserSolution.java');
      try {
        unlinkSync('UserSolution.class');
      } catch (e) {
        console.log('Failed to remove UserSolution.class');
      }
    }
  }

  static getTemplate(output: string): string | undefined {
    const returnTypeMatch = output.match(/Return type: ([^\n]+)/);
    const parametersSectionMatch = output.match(/Parameters: \[([^\n]+)\]/);

    if (!returnTypeMatch || !parametersSectionMatch) {
      console.error(
        `[getTemplate] solution method 의 명세(리턴타입과 파라미터 타입) 추출 실패! ${output}`,
      );
      throw new Error(
        `solution method 의 명세(리턴타입과 파라미터 타입) 추출 실패! ${output}`,
      );
    }

    const returnType = returnTypeMatch[1].trim();
    const parameterTypesMatches =
      parametersSectionMatch[1].match(/(\w+(\[\])*)/g) || [];

    if (parameterTypesMatches.length === 0) {
      console.error('Failed to extract parameter types.');
      throw new Error('Failed to extract parameter types.');
    }

    const parameterTypes = parameterTypesMatches.filter(
      (type, index) => index % 2 === 0,
    );

    const parameters = parameterTypes.join('');
    if (templateMap[returnType] && templateMap[returnType][parameters]) {
      return templateMap[returnType][parameters];
    } else {
      throw new Error(`template not found with method info output: ${output}`);
    }
  }
}
