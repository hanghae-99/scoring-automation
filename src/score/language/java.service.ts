import { execSync, spawnSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import {
  Int1DArrayAndInt1DArrayToInt,
  Int1DArrayToString,
  Int2DArrayAndIntA2DrrayAndBoolean2DArrayToInt2DArray,
  IntAndChar2DArrayToChar2DArray,
  IntAndIntToString,
  IntToInt,
  IntToString,
  String1DArrayAndIntToString1DArray,
  StringToInt,
  StringToString,
  templateMap,
} from './java.templates';

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
    console.log(`output from extractSolutionMethod: ${output})`);
    if (!output) {
      throw new Error('Failed to extract the solution method.');
    }

    return output;
  }

  private extractMethodInfoUsingAST(userCode: string): string {
    const jarPath = join(
      dirname(__filename),
      'libs',
      'ASTAnalyzer-1.0-SNAPSHOT.jar',
    );
    console.log(`usercode given to ASTAnalyzer: ${userCode}`);
    const command = `echo "${userCode}" | java -jar ${jarPath}`;
    const output = execSync(command, { encoding: 'utf-8' }).trim();
    console.log(
      `[ASTAnalyzer] output from extractMethodInfoUsingAST: ${output}`,
    );
    if (!output) {
      throw new Error('Failed to extract method info.');
    }

    return output;
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
    // argsArr: ArgumentType[][],
    argsArr: any[],
    answerIdx: number,
    questionIdx: number,
  ): any[] {
    // userCode 내부를 확인해서, parameters 와 return type 의 명세에 따라 templateType 을 결정한다.
    const methodInfo = this.extractMethodInfoUsingAST(userCode);
    const templateCode = this.getTemplate(methodInfo);

    console.log('✅ Template Code:\n', templateCode);

    const integratedCode = JavaService.integrateUserCodeWithTemplate(
      userCode,
      templateCode,
    );

    console.log('✅ Integrated Java Code:\n', integratedCode);
    const tempSrcFile = 'UserSolution.java';
    writeFileSync(tempSrcFile, integratedCode, 'utf-8');

    try {
      const jarPath = join(dirname(__filename), 'libs', 'gson-2.8.8.jar');
      execSync(`javac -cp ${jarPath} UserSolution.java`);
      return argsArr.map((args, idx) => {
        console.log(`${idx + 1}번째 테스트 케이스`);
        console.log(args);
        try {
          const jsonInput = JSON.stringify(args);
          console.log('JSON Input:', jsonInput);

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

          console.log(`Logs from Java App: ${stderr}`); // You can log the stderr output for debugging purposes

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

  getTemplate(output: string): string | undefined {
    console.log(`output from getTemplate: ${output}`);
    const returnTypeMatch = output.match(/Return type: ([^\n]+)/);
    const parametersSectionMatch = output.match(/Parameters: \[([^\n]+)\]/);

    if (!returnTypeMatch || !parametersSectionMatch) {
      console.error('Failed to parse the output.');
      throw new Error('Failed to parse the output.');
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
      console.log(
        ` ***** templateMap[returnType][parameters]: ${templateMap[returnType][parameters]}`,
      );
      return templateMap[returnType][parameters];
    }

    return undefined; // Return undefined if no matching template is found
  }
}
