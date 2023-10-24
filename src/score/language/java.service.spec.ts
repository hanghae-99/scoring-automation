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

  it('3번 문제 (questionIndex: 2) - 중복 단어 제거 로직에 대한 코드를 올바르게 실행할 수 있다.', () => {
    const userCodeString = `
    const userCode = \`import java.util.*;

public class Main {
    public static String[] solution(String[] arr, int n) {
        Map<String, Integer> hm = new HashMap<>();
        List<String> uniqueWords = new ArrayList<>();

        // 중볻단어 검사
        for (String str : arr) {
            hm.put(str, hm.getOrDefault(str, 0) + 1);
        }

        // 중복된 단어 전체제외
        for (String key : hm.keySet()) {
            if (hm.get(key) == 1) uniqueWords.add(key);
        }

        uniqueWords.sort((a, b) -> {
            char charA = a.charAt(n);   // n벉째 단어 추출
            char charB = b.charAt(n);   // n벉째 단어 추출
            if (charA == charB) {       // n벉째가 같으면 일반 오름차순 정렬
                return a.compareTo(b);
            }
            return Character.compare(charA, charB);
        });

        return uniqueWords.toArray(new String[0]);
    }

    public static void main(String[] args) {
        Main method = new Main();
        String[] arr = {"coke", "water", "glass", "dog", "dog", "yogurt", "vitamin"};
        int n = 2;
        System.out.println(Arrays.toString(method.solution(arr, n)));
    }
}
\``;
    const regex = /const userCode = \`(.*?)\`/s; // The 's' flag makes . match newline
    const match = userCodeString.match(regex);
    let userCode = '';

    if (match && match[1]) {
      userCode = match[1];
    }

    const argsArr = [
      [['brush', 'sun', 'brush', 'bed', 'car'], 1],
      [['banana', 'cat', 'car', 'apple', 'banana', 'banana'], 0],
      [['coke', 'water', 'glass', 'dog', 'dog', 'yogurt', 'vitamin'], 2],
    ];
    const expectedOutput = [
      ['car', 'bed', 'sun'],
      ['apple', 'car', 'cat'],
      ['glass', 'yogurt', 'coke', 'vitamin', 'water'],
    ];

    const output = javaService.executeJAVAOnEachArgs(userCode, argsArr, 2, 2);
    console.log(`**** output: ${JSON.stringify(output)}`);
    expect(output).toEqual(expectedOutput);
  });
});
