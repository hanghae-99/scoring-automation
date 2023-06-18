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
      argsArr: [["스파르타"], ["항해99"], ["개발자"]],
      correctAnswers: ["hello, 스파르타", "hello, 항해99", "hello, 개발자"],
    },
    2: {
      argsArr: [],
      correctAnswers: [],
    },
  },
};
