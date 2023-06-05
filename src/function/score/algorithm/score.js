import { executeJAVAOnEachArgs } from "./score.java.js";
import { executeJSOnEachArgs } from "./score.javascript.js";

function matchResultsWithAnswers(results, answers) {
  const correctAnswers = results.reduce((score, result, i) => {
    return score + (result === answers[i] ? 1 : 0);
  }, 0);

  return Math.floor((correctAnswers / answers.length) * 100);
}

export function score(language, code, argsArr, answers) {
  if (language !== "javascript" && language !== "java")
    throw new Error("지원하지 않는 언어입니다");

  return matchResultsWithAnswers(
    (language === "javascript" ? executeJSOnEachArgs : executeJAVAOnEachArgs)(
      code,
      argsArr
    ),
    answers
  );
}
