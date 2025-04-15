import { expect, test } from "vitest";
import {
  preprocessCategoryHeader,
  preprocessCategoryOption,
} from "./preprocessMSC";

test('Converts "Bearing Number" to "Bearing Trade Number"', () => {
  expect(preprocessCategoryHeader("Bearing Number")).toBe(
    "Bearing Trade Number",
  );
});

test('Converts "Inside Diameter (Decimal Inch)" to "ID"', () => {
  expect(preprocessCategoryHeader("Inside Diameter (Decimal Inch)")).toBe("ID");
});

test('Converts "Outside Diameter (Decimal Inch)" to "OD"', () => {
  expect(preprocessCategoryHeader("Outside Diameter (Decimal Inch)")).toBe(
    "OD",
  );
});

test('Converts "Overall Length (Inch)" to "Length"', () => {
  expect(preprocessCategoryHeader("Overall Length (Inch)")).toBe("Length");
});

test("Removes a hyphen from a fraction", () => {
  expect(preprocessCategoryOption("1-1/2", "Length (Inch)")).toBe('1 1/2"');
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

test("1/4 - 20 Thread size (unusual spacing)", () => {
  expect(preprocessCategoryOption("1/4 - 20")).toBe('1/4"-20');
});

test("Hyphen not removed if there are no numbers", () => {
  expect(preprocessCategoryOption("Flip-Flop")).toBe("Flip-Flop");
});

test('Includes " for Overall Length (Inch)', () => {
  expect(preprocessCategoryOption("1", "Overall Length (Inch)")).toBe('1"');
});
