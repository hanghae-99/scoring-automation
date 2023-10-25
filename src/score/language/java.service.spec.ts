import { JavaService } from './java.service';
import {
  Int2DArrayAndIntA2DrrayAndBoolean2DArrayToInt2DArray,
  IntToString,
} from './java.templates';

describe('JavaService', () => {
  const javaService = new JavaService();

  it('덧셈과 부호변화 로직에 대한 코드를 올바르게 실행할 수 있다.', () => {
    const userCode = `public class UserSolution {

    public int[][] solution(int[][] arr1, int[][] arr2, boolean[][] signs) {
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

  it('중복 단어 제거 로직에 대한 올바른 코드는 테스트케이스에 대한 모범답안과 일치한다.', () => {
    const correctUserCodeString = `
        const userCode = \`import java.util.*;

    public class Main {
        public String[] solution(String[] arr, int n) {
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
    const match = correctUserCodeString.match(regex);
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
  it('중복 단어 제거 로직에 대한 잘못된 코드는 테스트케이스에 대한 모범답안과 불일치한다.', () => {
    const wrongUserCodeString = `
    const userCode = \`import java.util.*;


public class test3 {
    public String[] solution(String[] arr, int n) {
        Map<String, String> map = new TreeMap<>();

        for(int i = 0; i < arr.length; i++){
            String plus = arr[i].substring(n, n + 1);
            int count = 0;
            for(int j = 0; j < arr.length; j++){
                if(arr[j] == arr[i]){
                    count++;
                }
            }

            if(count < 2){
                map.put(arr[i], plus);
            }
        }

        ArrayList<String> strList = new ArrayList<>(map.keySet());
        Collections.sort(strList, (o1, o2) -> (map.get(o1).compareTo(map.get(o2))));
        String[] answer = strList.toArray(new String[0]);

        return answer;
    }

    public static void main(String[] args) {
        test3 method = new test3();
        String[] arr = {"coke", "water", "glass", "dog", "dog", "yogurt", "vitamin"};
        int n = 2;
        System.out.println(Arrays.toString(method.solution(arr, n)));
    }
}

\``;

    const regex = /const userCode = \`(.*?)\`/s; // The 's' flag makes . match newline
    const match = wrongUserCodeString.match(regex);
    let userCode = '';

    if (match && match[1]) {
      userCode = match[1];
    }

    const argsArr = [
      [['brush', 'sun', 'brush', 'bed', 'car'], 1],
      [['banana', 'cat', 'car', 'apple', 'banana', 'banana'], 0],
      [['coke', 'water', 'glass', 'dog', 'dog', 'yogurt', 'vitamin'], 2],
    ];
    const correctOutput = [
      ['car', 'bed', 'sun'],
      ['apple', 'car', 'cat'],
      ['glass', 'yogurt', 'coke', 'vitamin', 'water'],
    ];

    const output = javaService.executeJAVAOnEachArgs(userCode, argsArr, 10, 10);
    // correctOutput과 다름을 assert
    expect(output).not.toEqual(correctOutput);
  });

  it('-에 대한 코드를 올바르게 실행할 수 있다.', () => {
    const userCode1 = `
import java.lang.reflect.Array;
import java.util.*;

public class Main {

    public int solution(int num) {
        int moneyReturn = 1000-num;
        // 거스름돈 선언
        int obeak = 0;
        int beak = 0;
        int osib = 0;
        int sib = 0;

        obeak = moneyReturn / 500;
        // 400원이면 500으로 나눈 나머지를 100으로 나눈 몫을 beak에 return
        // 100원부터 % 연산을하고 나누기 연산을 하면 거스름돈 개수가 가장 적게 잔돈을 줄 수 있음
        beak = moneyReturn %500 / 100;
        osib = moneyReturn %500 %100 / 50;
        sib = moneyReturn %500 %100 %50 / 10;
        // 거스름돈 최종개수
        int answer = obeak+beak+osib+sib;

        return answer;
    }

    public static void main(String[] args) {

        Main method = new Main();
        int N =550;
        System.out.println(method.solution(N));
    }
}`;

    const userCode2 = ``;

    const argsArr = [900, 550, 320, 160];
    const expectedOutput = [1, 5, 6, 8];

    const output = javaService.executeJAVAOnEachArgs(userCode1, argsArr, 0, 0);
    expect(output).toEqual(expectedOutput);
  });
  it('테스트2 에 대한 코드를 올바르게 실행할 수 있다.', () => {
    const userCode1 = `class Main2 {
    public int solution(String s) {
        int count =0;             //연속된 정답(O) 구하기
        int sum =0;
        int answer = 0;

        for(int i=0; i<s.length();i++){
            if(s.charAt(i)=='O'){           //s.substring(i,i+1)    처음에 이렇게 했는데 0 0 0 0 0 나온다.. 왜인지 모르겠다.
                count+=1;
            } else {
                count=0;                   //다음에 x나오면 바로 0으로 초기화 시켜버림   처음에 count+=0; 했다가  128나옴..
            }
            sum+=count;
//            System.out.println(sum);
        }
        System.out.println(sum);
        answer=sum;
        return answer;
    }
    public static void main(String[] args) {
        Main2 method = new Main2();
        String s = "OXOOOXXXOXOOXOOOOOXO";
        System.out.println(method.solution(s));
    }
}`;

    const userCode2 = ``;

    const argsArr = [
      [
        [9, 9, 8, 8, 7, 8, 9],
        [21, 25, 30, 29, 22, 23, 30],
      ],
      [
        [9, 7, 8, 9, 7, 9, 8],
        [23, 22, 26, 26, 29, 27, 22],
      ],
      [
        [9, 9, 9, 9, 7, 9, 8],
        [23, 23, 30, 28, 30, 23, 23],
      ],
    ];
    const expectedOutput = [96, 110, 102];

    const output = javaService.executeJAVAOnEachArgs(userCode1, argsArr, 0, 0);
    console.log(`**** output: ${JSON.stringify(output)}`);
    expect(output).toEqual(expectedOutput);
  });

  describe('getTemplate', () => {
    // 각 테스트 케이스에 대한 extractMethodInfoUsingAST 함수 모의하기
    const mockASTOutputIntToString = `
    Found method 'solution'.
    Return type: String
    Parameters: [int input]`;

    const mockASTOutput2DArrays = `
    Found method 'solution'.
    Return type: int[][]
    Parameters: [int[][] arr1, int[][] arr2, boolean[][] signs]`;

    it('int 입력과 String 출력에 대하여 IntToStringTemplate 반환하기', () => {
      // mockASTOutputIntToString를 입력으로 사용하기
      expect(JavaService.getTemplate(mockASTOutputIntToString)).toBe(
        IntToString,
      );
    });

    it('두 개의 int[][] 입력, 하나의 boolean[][] 입력 및 int[][] 출력에 대하여 TwoInt2DArrayAndBoolean2DArrayToInt2DArray 반환하기', () => {
      // mockASTOutput2DArrays를 입력으로 사용하기
      expect(JavaService.getTemplate(mockASTOutput2DArrays)).toBe(
        Int2DArrayAndIntA2DrrayAndBoolean2DArrayToInt2DArray,
      );
    });
  });
});
