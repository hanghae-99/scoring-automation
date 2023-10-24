import { execSync, spawnSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import {
  MATRIX_OPERATION_TEMPLATE,
  REMOVE_DUPLICATES_WORDS_TEMPLATE,
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

  private static integrateUserCodeWithTemplate(
    userCode: string,
    templateType: string,
  ): string {
    const solutionMethodBody = this.extractSolutionMethod(userCode);

    let template = '';
    switch (templateType) {
      case 'MATRIX_OPERATION':
        template = MATRIX_OPERATION_TEMPLATE;
        break;
      case 'REMOVE_DUPLICATES_WORDS_TEMPLATE':
        template = REMOVE_DUPLICATES_WORDS_TEMPLATE;
        break;
      default:
        throw new Error('유효하지 않은 템플릿 유형입니다.');
    }

    return template.replace('PLACEHOLDER', solutionMethodBody);
  }

  public executeJAVAOnEachArgs(
    userCode: string,
    // argsArr: ArgumentType[][],
    argsArr: any[],
    answerIdx: number,
    questionIdx: number,
  ): any[] {
    // answerIdx (? 또는 questionIdx) 에 따라 templateType 을 결정
    console.log(`answerIdx: ${answerIdx}, questionIdx: ${questionIdx}`);
    let templateType = '';
    switch (questionIdx) {
      case 0:
        templateType = 'MATRIX_OPERATION';
        break;
      case 2:
        templateType = 'REMOVE_DUPLICATES_WORDS_TEMPLATE';
        break;
      default:
        console.error(`유효하지 않은 questionIdx: ${questionIdx}`);
        return;
    }

    const integratedCode = JavaService.integrateUserCodeWithTemplate(
      userCode,
      templateType,
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
}
