export function preprocessCategoryOption(
  option: string,
  category?: string,
): string {
  if (isThreadSizeCategory(category) || isThreadSizeFormat(option)) {
    return processThreadSize(option);
  }

  if (isMixedFraction(option)) {
    return processMixedFraction(option);
  }

  return option;
}

/**
 * Determines if the given category represents a Thread Size in inches.
 * Looks for the substring "Thread Size" inside the category string.
 */
function isThreadSizeCategory(category?: string): boolean {
  return Boolean(category && /Thread Size/i.test(category)); // The i flag means case-insensitive
}

/**
 * Determines if the given option string resembles a thread size format.
 * @param option - The option string to check.
 * @returns True if the option matches thread size format, otherwise false.
 */
function isThreadSizeFormat(option: string): boolean {
  return /^(?:\d+-)?\d+\/\d+-\d+$/.test(option);
  // ^ — Start of string
  // (?:\d+-)? — Optional whole number and hyphen
  // \d+\/\d+ — Fraction part
  // - — Hyphen seperator
  // \d+ — Thread count
  // $ — End of the string.
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
  const threadCount = option.substring(lastHyphen + 1);
  // Convert mixed number hyphen to space, e.g., "1-1/4" -> "1 1/4"
  diameterPart = diameterPart.replace("-", " ");
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
