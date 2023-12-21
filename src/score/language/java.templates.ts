// (1) solution 에 parameter 가 int[][] arr1, int[][] arr2, boolean[][] signs 인 타입
export const MATRIX_OPERATION_TEMPLATE = `
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

        // UserSolution 클래스의 인스턴스 생성
        UserSolution instance = new UserSolution();

        // 생성된 인스턴스를 사용하여 solution 메서드 호출
        int[][] result = instance.solution(arr1, arr2, signs);

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

// (2) solution 에 parameter 가 String[] arr, int n 인 타입
export const REMOVE_DUPLICATES_WORDS_TEMPLATE = `
import java.util.*;
import com.google.gson.Gson;

public class UserSolution {
    PLACEHOLDER

    public static void main(String[] args) {
        System.err.println("main 메서드가 시작되었습니다.");
        System.err.println("JSON 입력 확인: " + args[0]);

        Gson gson = new Gson();
        List<Object> inputList = gson.fromJson(args[0], List.class);

        // 첫 번째 원소를 List<String>으로 변환
        List<String> arrList = (List<String>) inputList.get(0);
        String[] arr = arrList.toArray(new String[0]);

        // 두 번째 원소를 Double로 변환한 후 int로 변환
        Double nAsDouble = (Double) inputList.get(1);
        int n = nAsDouble.intValue();

        // UserSolution 클래스의 인스턴스 생성
        UserSolution instance = new UserSolution();

        // 생성된 인스턴스를 사용하여 solution 메서드 호출
        String[] result = instance.solution(arr, n);
        System.out.print(gson.toJson(result));
    }
}
`;
// input 과 output 의 타입에 따라 다른 템플릿을 사용한다.
// [CASE1] input1: int, output: String
export const IntToString = `
import java.util.*;
import com.google.gson.Gson;

public class UserSolution {
    PLACEHOLDER

    public static void main(String[] args) {
        System.err.println("main 메서드가 시작되었습니다.");
        System.err.println("JSON 입력 확인: " + args[0]);
        
        int input1 = Integer.parseInt(args[0]);
        UserSolution instance = new UserSolution();
        String result = instance.solution(input1);
        System.out.print(new Gson().toJson(result));
    }
}`;

// [CASE2] input1: int[], output: String
export const Int1DArrayToString = `
import java.util.*;
import com.google.gson.Gson;

public class UserSolution {
    PLACEHOLDER

    public static void main(String[] args) {
        System.err.println("main 메서드가 시작되었습니다.");
        System.err.println("JSON 입력 확인: " + args[0]);

        int[] input1 = Arrays.stream(args[0].split(",")).mapToInt(Integer::parseInt).toArray();
        UserSolution instance = new UserSolution();
        String result = instance.solution(input1);
        System.out.print(new Gson().toJson(result));
    }
}`;

// [CASE3] input1: int, output: int
export const IntToInt = `
import java.util.*;
import com.google.gson.Gson;

public class UserSolution {
    PLACEHOLDER

    public static void main(String[] args) {
        System.err.println("main 메서드가 시작되었습니다.");
        System.err.println("JSON 입력 확인: " + args[0]);

        int input1 = Integer.parseInt(args[0]);
        UserSolution instance = new UserSolution();
        int result = instance.solution(input1);
        System.out.print(new Gson().toJson(result));
    }
}`;

// [CASE4] input1: String, output: int
export const StringToInt = `
import java.util.*;
import com.google.gson.Gson;

public class UserSolution {
    PLACEHOLDER

    public static void main(String[] args) {
        System.err.println("main 메서드가 시작되었습니다.");
        System.err.println("JSON 입력 확인: " + args[0]);

        String input1 = args[0];
        UserSolution instance = new UserSolution();
        int result = instance.solution(input1);
        System.out.print(new Gson().toJson(result));
    }
}`;

// [CASE5] input1: int, input2: char[][], output: char[][]
export const IntAndChar2DArrayToChar2DArray = `
import java.util.*;
import com.google.gson.Gson;

public class UserSolution {
    PLACEHOLDER

    public static void main(String[] args) {
        System.err.println("main 메서드가 시작되었습니다.");
        System.err.println("JSON 입력 확인: " + args[0]);

        int input1 = Integer.parseInt(args[0]);
        char[][] input2 = gson.fromJson(args[1], char[][].class);

        UserSolution instance = new UserSolution();
        char[][] result = instance.solution(input1, input2);
        System.out.print(new Gson().toJson(result));
    }
}`;

// [CASE6] input1: int, input2: int, output: String
export const IntAndIntToString = `
import java.util.*;
import com.google.gson.Gson;

public class UserSolution {
    PLACEHOLDER

    public static void main(String[] args) {
        System.err.println("main 메서드가 시작되었습니다.");
        System.err.println("JSON 입력 확인: " + args[0]);

        int input1 = Integer.parseInt(args[0]);
        int input2 = Integer.parseInt(args[1]);
        UserSolution instance = new UserSolution();
        String result = instance.solution(input1, input2);
        System.out.print(new Gson().toJson(result));
    }
}`;

// [CASE7] input1: int[], input2: int[], output: int
export const Int1DArrayAndInt1DArrayToInt = `
import java.util.*;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class UserSolution {
    PLACEHOLDER

    public static void main(String[] args) {
        System.err.println("[int1darray and int1darray] main 메서드가 시작되었습니다.");
        System.err.println("JSON 입력 확인: " + args[0]);

        Gson gson = new Gson();

        // Assuming args[0] contains the JSON string of the two arrays
        List<List<Integer>> inputLists = gson.fromJson(args[0], new TypeToken<List<List<Integer>>>(){}.getType());
        
        // Extracting the two integer arrays from the list
        int[] input1 = inputLists.get(0).stream().mapToInt(i -> i).toArray();
        System.err.println("input1: " + Arrays.toString(input1));
        int[] input2 = inputLists.get(1).stream().mapToInt(i -> i).toArray();
        System.err.println("input2: " + Arrays.toString(input2));
        
        UserSolution instance = new UserSolution();
        int result = instance.solution(input1, input2);
        System.out.print(new Gson().toJson(result));
    }
}`;

// [CASE8] input1: String, output: String
// export const StringToString = `
// import java.util.*;
// import com.google.gson.Gson;
//
// public class UserSolution {
//     PLACEHOLDER
//
//     public static void main(String[] args) {
//         System.err.println("^0^(string to string) main 메서드가 시작되었습니다.");
//         System.err.println("JSON 입력 확인: " + args[0]);
//
//         String input1 = args[0];
//         System.err.println(" **** input1: " + input1);
//         UserSolution instance = new UserSolution();
//         String result = instance.solution(input1);
//         System.out.print(new Gson().toJson(result));
//     }
// }`;
export const StringToString = `
import java.util.*;
import com.google.gson.Gson;

public class UserSolution {
    PLACEHOLDER

    public static void main(String[] args) {
        System.err.println("^0^(string to string) main 메서드가 시작되었습니다.");
        System.err.println("JSON 입력 확인: " + args[0]);

        Gson gson = new Gson();

        // Parsing the JSON string to get the actual string value
        String input1 = gson.fromJson(args[0], String.class);
        System.err.println(" **** input1: " + input1);

        UserSolution instance = new UserSolution();
        String result = instance.solution(input1);
        System.out.print(new Gson().toJson(result));
    }
}
`;

// [CASE9] input1: int[][], input2: int[][], input3: boolean[][], output: int[][]
export const Int2DArrayAndIntA2DrrayAndBoolean2DArrayToInt2DArray = `
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

        // UserSolution 클래스의 인스턴스 생성
        UserSolution instance = new UserSolution();

        // 생성된 인스턴스를 사용하여 solution 메서드 호출
        int[][] result = instance.solution(arr1, arr2, signs);

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

}`;

// [CASE10] input1: String[], input2: int, output: String[]
export const String1DArrayAndIntToString1DArray = `
import java.util.*;
import com.google.gson.Gson;

public class UserSolution {
    PLACEHOLDER

    public static void main(String[] args) {
        System.err.println("main 메서드가 시작되었습니다.");
        System.err.println("JSON 입력 확인: " + args[0]);

        Gson gson = new Gson();
        List<Object> inputList = gson.fromJson(args[0], List.class);

        // 첫 번째 원소를 List<String>으로 변환
        List<String> arrList = (List<String>) inputList.get(0);
        String[] arr = arrList.toArray(new String[0]);

        // 두 번째 원소를 Double로 변환한 후 int로 변환
        Double nAsDouble = (Double) inputList.get(1);
        int n = nAsDouble.intValue();

        // UserSolution 클래스의 인스턴스 생성
        UserSolution instance = new UserSolution();

        // 생성된 인스턴스를 사용하여 solution 메서드 호출
        String[] result = instance.solution(arr, n);
        System.out.print(gson.toJson(result));
    }
}`;

export const templateMap: { [key: string]: { [key: string]: string } } = {
  String: {
    int: IntToString,
    'int[]': Int1DArrayToString,
    String: StringToString,
    intint: IntAndIntToString,
  },
  int: {
    int: IntToInt,
    String: StringToInt,
    'int[]int[]': Int1DArrayAndInt1DArrayToInt,
  },
  'char[][]': { 'intchar[][]': IntAndChar2DArrayToChar2DArray },
  'String[]': {
    'String[]int': String1DArrayAndIntToString1DArray,
  },
  'int[][]': {
    'int[][]int[][]boolean[][]':
      Int2DArrayAndIntA2DrrayAndBoolean2DArrayToInt2DArray,
  },
};
