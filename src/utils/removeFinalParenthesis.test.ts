import { expect, test } from "vitest";
import removeFinalParenthesis from "./removeFinalParenthesis";

test("Returns the same string if no parentheses is provided", () => {
  expect(removeFinalParenthesis("Length")).toEqual("Length");
});

test("Removes the final word in parentheses if no key is provided", () => {
  expect(removeFinalParenthesis("Length (Inch)")).toBe("Length");
});

test("Removes the key word if key is provided and final parentheses contains the key", () => {
  expect(removeFinalParenthesis("Length (Inch)", "Inch")).toBe("Length");
});

test("Returns the same string if the final word in the parentheses doesn't match the provided key", () => {
  expect(removeFinalParenthesis("Length (mm)", "Inch")).toBe("Length (mm)");
});
