import { Script } from "node:vm";
import {
  defaultContext,
  defaultRunInContextOption,
} from "./resource/config.js";

export function executeJSOnEachArgs(userCode, argsArr) {
  try {
    new Script(userCode);
  } catch (e) {
    if (e instanceof SyntaxError) throw new Error("문법이 정확하지 않습니다");
    throw e;
  }

  /**
   * @description
   * function 선언만 존재해야함
   * 호출까지 하면 에러남
   */
  const userScript = new Script(`(${userCode}).apply(null, args)`);

  return argsArr
    .map((args) => ({ ...defaultContext, args }))
    .map((ctx) => userScript.runInNewContext(ctx, defaultRunInContextOption));
}
