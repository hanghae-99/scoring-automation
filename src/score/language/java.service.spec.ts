import { JavaService } from './java.service';

describe('JavaService', () => {
  const javaService = new JavaService();

  it('1번 문제(questionIndex: 0) - 덧셈과 부호변화 로직에 대한 코드를 올바르게 실행할 수 있다.', () => {
    const userCode = `public class UserSolution {

    public static int[][] solution(int[][] arr1, int[][] arr2, boolean[][] signs) {
        int rows = arr1.length;
        int cols = arr1[0].length;
        int[][] answer = new int[rows][cols];

        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                int val1 = signs[i][j] ? arr1[i][j] : -arr1[i][j];
                int val2 = signs[i][j] ? arr2[i][j] : -arr2[i][j];
                answer[i][j] = val1 + val2;
            }
        }

        return answer;
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
      [
        [[1], [2]],
        [[3], [4]],
        [[false], [false]],
      ],
      [
        [
          [5, 7, 1],
          [2, 3, 5],
        ],
        [
          [5, 1, 6],
          [7, 5, 6],
        ],
        [
          [true, true, false],
          [false, true, false],
        ],
      ],
    ];
    const expectedOutput = [
      [
        [4, 6],
        [7, -9],
      ],
      [[-4], [-6]],
      [
        [10, 8, -7],
        [-9, 8, -11],
      ],
    ];

    const output = javaService.executeJAVAOnEachArgs(userCode, argsArr, 0, 0);
    console.log(`**** output: ${JSON.stringify(output)}`);
    expect(output).toEqual(expectedOutput);
  });
});
