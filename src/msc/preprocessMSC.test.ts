import { expect, test } from "vitest";
import { preprocessCategoryOption } from "./preprocessMSC";

test("Removes a hyphen from a fraction", () => {
  expect(preprocessCategoryOption("1-1/2", "Length (Inch)")).toBe("1 1/2");
});

test("Thread Size conversion 1/4-20", () => {
  expect(preprocessCategoryOption("1/4-20", "Thread Size (Inch)")).toBe(
    '1/4"-20',
  );
});

test("Thread Size conversion 1-1/4-12", () => {
  expect(preprocessCategoryOption("1-1/4-12", "Thread Size (Inch)")).toBe(
    '1 1/4"-12',
  );
});

test("Thread Size with no unit given (Inch)", () => {
  expect(preprocessCategoryOption("1-3/8-12")).toBe('1 3/8"-12');
});

test("Thread Size with no unit given (Inch)", () => {
  expect(preprocessCategoryOption("1/4-12")).toBe('1/4"-12');
});

test("6-32 Thread size", () => {
  expect(preprocessCategoryOption("#6-32", "Thread Size (Inch)")).toBe("#6-32");
});

test("1-8 Thread size", () => {
  expect(preprocessCategoryOption("1-8", "Thread Size (Inch)")).toBe('1"-8');
});

test("Thread Size with no unit given (mm)", () => {
  expect(preprocessCategoryOption("M8")).toBe("M8");
});

test("Hyphen not removed if there are no numbers", () => {
  expect(preprocessCategoryOption("Flip-Flop")).toBe("Flip-Flop");
});
