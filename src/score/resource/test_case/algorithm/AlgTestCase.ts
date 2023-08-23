const question_1 = ['스파르타', '항해99', '개발자'];

export const algTestCase: {
  [K in string]: {
    argsArr: any[];
    correctAnswers: any[];
    point: number;
  };
} = {
  '0번': {
    argsArr: question_1.map((w) => [w]),
    correctAnswers: question_1.map((w) => `hello, ${w}`),
    point: 0,
  },
  '1번': {
    argsArr: [
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
    ],
    correctAnswers: [
      [
        [4, 6],
        [7, -9],
      ],
      [[-4], [-6]],
      [
        [10, 8, -7],
        [-9, 8, -11],
      ],
    ],
    point: 1,
  },
  '2번': {
    argsArr: [[3], [6], [9]],
    correctAnswers: [
      `  *  \n *** \n*****`,
      `     *     \n    ***    \n   *****   \n  *******  \n ********* \n***********`,

      `        *        \n       ***       \n      *****      \n     *******     \n    *********    \n   ***********   \n  *************  \n *************** \n*****************`,
    ],
    point: 2,
  },
  '3번': {
    argsArr: [
      [['brush', 'sun', 'brush', 'bed', 'car'], 1],
      [['banana', 'cat', 'car', 'apple', 'banana', 'banana'], 0],
      [['coke', 'water', 'glass', 'dog', 'dog', 'yogurt', 'vitamin'], 2],
    ],
    correctAnswers: [
      ['car', 'bed', 'sun'],
      ['apple', 'car', 'cat'],
      ['glass', 'yogurt', 'coke', 'vitamin', 'water'],
    ],
    point: 3,
  },
};
