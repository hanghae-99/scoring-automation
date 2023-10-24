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
