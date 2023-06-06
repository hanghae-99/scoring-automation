import { executeJAVAOnEachArgs } from "./score.java.js";
import { executeJSOnEachArgs } from "./score.javascript.js";

function matchResultsWithAnswers(results, answers) {
  const correctAnswers = results.reduce(
    (score, result, i) => (result === answers[i] ? score + 1 : score),
    0
  );

  return Math.floor((correctAnswers / answers.length) * 100);
}

export function score(language, code, argsArr, answers) {
  if (language !== "javascript" && language !== "java")
    throw new Error("지원하지 않는 언어입니다");

  const targetAlgorithm =
    language === "javascript" ? executeJSOnEachArgs : executeJAVAOnEachArgs;

  return matchResultsWithAnswers(targetAlgorithm(code, argsArr), answers);
}
