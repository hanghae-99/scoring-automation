// 0번
export function example(to) {
  return `hello, ${to}!`;
}

// 1번
export function solution1(uint) {
  const eachNumber = String(uint).split('').map(Number).reverse();
  const sum = eachNumber.reduce((acc, curr) => acc + curr, 0);

  return eachNumber.join('+') + `=${sum}`;
}

// 2번
export function solution(len) {
  let result = '';
  for (let i = 1; i <= +len; i++) {
    const space = ' '.repeat(len - i);
    result += space + '*'.repeat(1 + (i - 1) * 2) + space + '\n';
  }

  return result.trimEnd();
}

// 3번
export function solution3(numMap) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const curr = numMap[i][j];
      const [l, r, u, d] = [
        numMap[i][j - 1],
        numMap[i][j + 1],
        numMap[i - 1]?.[j],
        numMap[i + 1]?.[j],
      ].map((n) => n ?? 0);

      if (curr > l && curr > r && curr > u && curr > d) {
        numMap[i][j] = '*';
      }
    }
  }

  return numMap.map((row) => row.join(' ')).join('\n');
}
