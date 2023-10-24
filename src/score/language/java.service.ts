import { execSync, spawnSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
type SimpleType = number | string | boolean;
type ArgumentType = SimpleType[] | SimpleType[][];

export class JavaService {
  private static MATRIX_OPERATION_TEMPLATE = `
import java.util.*;
import com.google.gson.Gson;

public class UserSolution {
    PLACEHOLDER

    public static void main(String[] args) {
        // Deserialize the JSON input
        Gson gson = new Gson();
        List<List<List<Object>>> input = gson.fromJson(args[0], List.class);

        int[][] arr1 = convertToInt2DArray(input.get(0));
        int[][] arr2 = convertToInt2DArray(input.get(1));
        boolean[][] signs = convertToBoolean2DArray(input.get(2));

        int[][] result = solution(arr1, arr2, signs);
        System.out.print(Arrays.deepToString(result));
    }

    private static int[][] convertToInt2DArray(List<List<Object>> input) {
        int[][] output = new int[input.size()][];
        for (int i = 0; i < input.size(); i++) {
            output[i] = input.get(i).stream().mapToInt(num -> ((Double) num).intValue()).toArray();
        }
        return output;
    }

    private static boolean[][] convertToBoolean2DArray(List<List<Object>> input) {
        boolean[][] output = new boolean[input.size()][];
        for (int i = 0; i < input.size(); i++) {
            List<Object> row = input.get(i);
            boolean[] boolRow = new boolean[row.size()];
            for (int j = 0; j < row.size(); j++) {
                boolRow[j] = (Boolean) row.get(j);
            }
            output[i] = boolRow;
        }
    return output;
}

}
`;

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
        template = this.MATRIX_OPERATION_TEMPLATE;
        break;
      default:
        throw new Error('유효하지 않은 템플릿 유형입니다.');
    }

    return template.replace('PLACEHOLDER', solutionMethodBody);
  }

  // private static integrateUserCodeWithTemplate(
  //   userCode: string,
  //   templateType: string,
  // ): string {
  //   console.log(`(1) userCode: ${userCode}`);
  //   const solutionMethodBodyMatch = userCode.match(
  //     /public static int\[\]\[\] solution\(.+\) \{([\s\S]+?)\}/,
  //   );
  //   console.log(`(2) solutionMethodBodyMatch: ${solutionMethodBodyMatch}`);
  //   const solutionMethodMatch = solutionMethodBodyMatch[1];
  //   console.log(`(3) solutionMethodMatch: ${solutionMethodMatch}`);
  //
  //   if (!solutionMethodMatch) {
  //     throw new Error('유효한 solution 메서드를 찾을 수 없습니다.');
  //   }
  //   let template = '';
  //   switch (templateType) {
  //     case 'MATRIX_OPERATION':
  //       template = this.MATRIX_OPERATION_TEMPLATE;
  //       break;
  //     default:
  //       throw new Error('유효하지 않은 템플릿 유형입니다.');
  //   }
  //
  //   return template.replace('PLACEHOLDER', solutionMethodMatch);
  // }

  public executeJAVAOnEachArgs(
    userCode: string,
    argsArr: ArgumentType[][],
    templateType: string,
  ): any[] {
    console.log(`argsArr: ${JSON.stringify(argsArr)}`);

    const integratedCode = JavaService.integrateUserCodeWithTemplate(
      userCode,
      templateType,
    );
    console.log('✅ Integrated Java Code:\n', integratedCode);
    const tempSrcFile = 'UserSolution.java';
    writeFileSync(tempSrcFile, integratedCode, 'utf-8');

    try {
      // execSync(`javac ${tempSrcFile}`);
      // execSync(`javac -cp ./libs/gson-2.8.8.jar ${tempSrcFile}`);
      const jarPath = join(dirname(__filename), 'libs', 'gson-2.8.8.jar');
      execSync(`javac -cp ${jarPath} UserSolution.java`);
      return argsArr.map((args, idx) => {
        console.log(`${idx + 1}번째 테스트 케이스`);
        console.log(args);
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
