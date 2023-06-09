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
    argsArr: [['12345'], ['1532576'], ['718253'], ['11112222']],
    correctAnswers: [
      '5+4+3+2+1=15',
      '6+7+5+2+3+5+1=29',
      '3+5+2+8+1+7=26',
      '2+2+2+2+1+1+1+1=12',
    ],
    point: 1,
  },
  '2번': {
    argsArr: [[3], [6], [9], [4]],
    correctAnswers: [
      `  *  \n *** \n*****`,
      `     *     \n    ***    \n   *****   \n  *******  \n ********* \n***********`,

      `        *        \n       ***       \n      *****      \n     *******     \n    *********    \n   ***********   \n  *************  \n *************** \n*****************`,
      `   *   \n  ***  \n ***** \n*******`,
    ],
    point: 2,
  },
  '3번': {
    argsArr: [
      [
        [
          [3, 4, 1, 4, 9],
          [2, 9, 4, 5, 8],
          [9, 0, 8, 2, 1],
          [7, 0, 2, 8, 4],
          [2, 7, 2, 1, 4],
        ],
      ],
      [
        [
          [7, 4, 6, 5, 9],
          [6, 1, 3, 4, 5],
          [4, 8, 5, 6, 9],
          [1, 3, 0, 6, 4],
          [6, 4, 8, 1, 7],
        ],
      ],
      [
        [
          [3, 4, 1, 4, 9],
          [6, 1, 3, 0, 5],
          [9, 0, 8, 2, 1],
          [1, 3, 0, 6, 4],
          [2, 9, 2, 3, 4],
        ],
      ],
    ],
    correctAnswers: [
      `3 4 1 4 *\n2 * 4 5 8\n* 0 * 2 1\n7 0 2 * 4\n2 * 2 1 4`,
      `* 4 * 5 *\n6 1 3 4 5\n4 * 5 6 *\n1 3 0 6 4\n* 4 * 1 *`,
      `3 * 1 4 *\n6 1 3 0 5\n* 0 * 2 1\n1 3 0 * 4\n2 * 2 3 4`,
    ],
    point: 3,
  },
};
