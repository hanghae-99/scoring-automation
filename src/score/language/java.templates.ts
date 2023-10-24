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
