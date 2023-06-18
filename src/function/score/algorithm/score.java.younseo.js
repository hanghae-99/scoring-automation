const { JavaShell } = require('java-shell');
const XLSX = require('xlsx');

// npm install java-shell xlsx npm 명령어로 엑셀파일 접근 및 java 코드 실행

async function scoreJavaAlgorithmProblem(javaCode, testCases) {
  let totalScore = 0;

  for (let i = 0; i < testCases.length; i++) {
    const { input, expectedOutput, score } = testCases[i];

    const javaOutput = await runJavaCode(javaCode, input);

    if (javaOutput === expectedOutput) {
      totalScore += score;
    }
  }

  return totalScore;
}

async function runJavaCode(javaCode, input) {
  const javaShell = new JavaShell({
    javaHome: '/path/to/jdk-11' // 여기에 JDK 11 설치 경로를 입력하기 
  });

  const result = await javaShell.execute({
    classPath: '.',
    className: 'Main',
    source: javaCode,
    stdin: input
  });

  if (result.error) {
    console.error('오류:', result.error);
    return null;
  }

  return result.stdout;
}

// 예시 사용법
const workbook = XLSX.readFile('testdata.xlsx'); // 여기에 Excel 파일 경로를 입력하세요
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet);

const javaCode = `public class Main {
  public static void main(String[] args) {
    System.out.println("안녕, 세계!");
  }
}`;

const input = '';

const testCases = data.map(({ input, expectedOutput, score }) => ({
  input,
  expectedOutput,
  score
}));

scoreJavaAlgorithmProblem(javaCode, testCases)
  .then(score => {
    console.log(`총 점수: ${score}`);
  })
  .catch(error => {
    console.error('오류:', error);
  });