const question_1 = ['스파르타', '항해99', '개발자'];

export const algTestCase: {
  questions: {
    [K in string]: {
      argsArr: any[];
      correctAnswers: any[];
    };
  };
} = {
  questions: {
    1: {
      argsArr: question_1.map((w) => [w]),
      correctAnswers: question_1.map((w) => `hello, ${w}`),
    },
    2: {
      argsArr: [],
      correctAnswers: [],
    },
  },
};
