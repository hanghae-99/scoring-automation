import { JavaService } from './java.service';

describe('JavaService', () => {
  const service = new JavaService();

  it('should execute Java code correctly', () => {
    const userCode = `
      public class UserSolution {
        public static void main(String[] args) {
          System.out.println("\\"" + args[0] + "\\"");
        }
      }
    `;
    const argsArr = [['Hello'], ['World']];

    const result = service.executeJAVAOnEachArgs(userCode, argsArr);

    expect(result).toEqual(['Hello', 'World']);
  });
});

describe('UserSolution', () => {
  const javaService = new JavaService();

  it('should return correct array based on signs', () => {
    const userCode = `import java.util.Arrays;

public class UserSolution {
    public int[][] solution(int[][] arr1, int[][] arr2, boolean[][] signs) {
        int len1 = arr1.length;
        int len2 = arr1[0].length;
        int[][] answer = new int[len1][len2];

        for(int i=0; i<len1; i++){
            for(int j=0; j<len2; j++){
               int sum = arr1[i][j] + arr2[i][j];
               answer[i][j] = signs[i][j]? sum:sum*(-1);
            }
        }
        return answer;
    }

    public static void main(String[] args) {
        UserSolution method = new UserSolution();
        int[][] arr1 = {{5,7,1},{2,3,5}};
        int[][] arr2 = {{5,1,6},{7,5,6}};
        boolean[][] signs={{true,true,false},{false,true,false}};
        System.out.println(Arrays.deepToString(method.solution(arr1, arr2, signs)));
    }
}`;
    const argsArr = [
      [
        [
          [1, 2],
          [2, 3],
        ],
        [
          [3, 4],
          [5, 6],
        ],
        [
          [true, true],
          [true, false],
        ],
      ],
    ];
    const expectedOutput = [
      [true, true],
      [true, false],
    ];

    const output = javaService.executeJAVAOnEachArgs(userCode, argsArr);
    expect(output[0]).toEqual(expectedOutput);
  });
});
