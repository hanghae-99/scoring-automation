import { score } from "../score.js";
import { readFileSync } from "node:fs";
import { strict as assert } from "node:assert";
import { test } from "node:test";

// node --test
test("100점이 나와야합니다", () => {
  const argsArr = [["world"], ["JS"], ["HANGHAE99"]];
  const answers = ["hello, world!", "hello, JS!", "hello, HANGHAE99!"];
  const code = readFileSync(new URL("example.js", import.meta.url), "utf8");

  assert.equal(score("javascript", code, argsArr, answers), 100);
});

test("75점이 나와야합니다", () => {
  const argsArr = [["world"], ["JS"], ["HANGHAE99"], ["Bootcamp"]];
  const answers = [
    "goodbye, world!",
    "hello, JS!",
    "hello, HANGHAE99!",
    "hello, Bootcamp!",
  ];
  const code = readFileSync(new URL("example.js", import.meta.url), "utf8");

  assert.equal(score("javascript", code, argsArr, answers), 75);
});
