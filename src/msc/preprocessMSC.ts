import removeFinalParenthesis from "../utils/removeFinalParenthesis";

export function preprocessCategoryHeader(header: string) {
  let result = header;
  result = result.replace(/Bearing Number/gi, "Bearing Trade Number");

  result = result.replace(/Inside Diameter/gi, "ID");
  result = result.replace(/Outside Diameter/gi, "OD");
  result = result.replace(/Overall Length/gi, "Length");

  result = removeFinalParenthesis(result);
  return result;
}

export function preprocessCategoryOption(
  option: string,
  category?: string,
): string {
  if (isThreadSizeCategory(category) || isThreadSizeFormat(option)) {
    return processThreadSize(option);
  }

  if (isMixedFraction(option)) {
    option = processMixedFraction(option);
  }

  if (isLength(category) && isInch(category))
    return option.replace(/(\d)(?!.*\d)/, `$1"`); // Replaces last digit with itself plus "

  return option;
}

function isLength(category?: string) {
  return Boolean(category && /Length/i.test(category));
}

function isInch(category?: string) {
  return Boolean(category && /Inch/i.test(category));
}

/**
 * Determines if the given category represents a Thread Size in inches.
 * Looks for the substring "Thread Size" inside the category string.
 */
function isThreadSizeCategory(category?: string): boolean {
  return Boolean(category && /Thread Size/i.test(category));
}

/**
 * Checks if the input string matches a thread size format.
 * Accepted formats include:
 *   - "1/4-20"
 *   - "1/4 - 20"
 *   - "3-1/2-20"
 *   - "3-1/2 - 20"
 *
 * Format breakdown:
 *   - Optional leading number and dash (e.g., "3-")
 *   - A required fraction (e.g., "1/2", "5/16")
 *   - Optional spaces around a dash
 *   - A required trailing number (e.g., "20")
 *
 * Regular expression breakdown:
 *   ^                → Start of string
 *   (?:\d+-)?        → Optional leading whole number and dash (non-capturing group)
 *   \d+\/\d+         → Required fraction (e.g., 1/2)
 *   \s*-\s*          → Dash with optional spaces before/after
 *   \d+              → Required trailing number (e.g., thread count)
 *   $                → End of string
 * @param option - The option string to check.
 * @returns True if the option matches thread size format, otherwise false.
 */
function isThreadSizeFormat(option: string): boolean {
  return /^(?:\d+-)?\d+\/\d+\s*-\s*\d+$/.test(option);
}

// To handle small screw sizes with no "
const DIAMETER_SIZE_NO_APOSTROPHE = [
  "#0",
  "#1",
  "#2",
  "#3",
  "#4",
  "#5",
  "#6",
  "#8",
  "#10",
  "#12",
];

/**
 * Processes options for Thread Size (Inch) category, appending a double-quote
 * to the diameter part and preserving the hyphen before the thread count.
 */
function processThreadSize(option: string): string {
  const lastHyphen = option.lastIndexOf("-");
  if (lastHyphen < 0) {
    return option;
  }

  let diameterPart = option.substring(0, lastHyphen);
  const threadCount = option.substring(lastHyphen + 1).trim();
  // Convert mixed number hyphen to space, e.g., "1-1/4" -> "1 1/4"
  diameterPart = diameterPart.replace("-", " ").trim();
  const shouldContainApostrophe =
    !DIAMETER_SIZE_NO_APOSTROPHE.includes(diameterPart);

  return `${diameterPart}${shouldContainApostrophe ? '"' : ""}-${threadCount}`;
}

/**
 * Checks if the option is a mixed fraction of the form "integer-fraction".
 */
function isMixedFraction(option: string): boolean {
  return /^\d+-\d+\/\d+$/.test(option);
  // ^ — Start of the string.
  // \d+ — One or more digits (the whole number, e.g., 1).
  // - — A literal hyphen character (-) between the whole number and the fraction.
  // \d+ — One or more digits (numerator of fraction, e.g., 1 in 1/2).
  // / — A literal forward slash (/) between numerator and denominator.
  // \d+ — One or more digits (denominator of fraction, e.g., 2 in 1/2).
  // $ — End of the string.
}

/**
 * Converts a mixed fraction from "integer-fraction" to "integer fraction".
 */
function processMixedFraction(option: string): string {
  const match = option.match(/^\d+-(\d+\/\d+)$/);
  // ^ — Start of the string.
  // (\d+) — Capture group 1: One or more digits (whole number).
  // - — A literal hyphen separating the two parts.
  // (\d+\/\d+) — Capture group 2: One or more digits, then a slash, then one or more digits (the fraction part).
  // $ — End of the string.

  if (!match) {
    return option;
  }

  const [, fraction] = match;
  const whole = option.split("-")[0];
  return `${whole} ${fraction}`;
}

// TODO: McMaster Hardness value: Durometer 70A (Medidum) vs. MSC Hardness options ["70","75","80","90"]
