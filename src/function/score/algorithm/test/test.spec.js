import { score } from "../score.js";
import { readFileSync } from "node:fs";
import { strict as assert } from "node:assert";
import { test } from "node:test";

const argsArr = [["world"], ["JS"], ["HANGHAE99"]];
const answers = ["hello, world!", "hello, JS!", "hello, HANGHAE99!"];
const code = readFileSync(new URL("example.js", import.meta.url), "utf8");

// node src/function/score/algorithm/test/test.spec.js

test("score example", () => {
  assert.equal(score("javascript", code, argsArr, answers), 100);
});
