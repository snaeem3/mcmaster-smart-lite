/**
 * Removes the final parenthetical segment (including the parentheses) from a string.
 *
 * If a `key` is provided, the final parentheses are only stripped if their contents
 * exactly match the `key`. If no matching parentheses are found (or the contents
 * don’t match the key), the original string is returned unchanged.
 *
 * @example
 * // returns "Size"
 * removeFinalParenthesis("Size (Large)");
 * @example
 * // returns "Color (Red) Shade"
 * removeFinalParenthesis("Color (Red) Shade");
 * @example
 * // returns "Weight (kg)"
 * removeFinalParenthesis("Weight (kg) (g)", "g");
 * @example
 * // returns "Weight (kg) (lb)"
 * removeFinalParenthesis("Weight (kg) (lb)", "g");
 *
 * @param {string} str - The input string, which may or may not end with a parenthetical segment.
 * @param {string} [key] - If provided, only remove the final parentheses if their inner text exactly equals this key. Case-sensitive.
 * @returns {string} The resulting string with the final `(…)` removed if applicable, otherwise the original string.
 */
export default function removeFinalParenthesis(
  str: string,
  key?: string,
): string {
  // Try to match the last parentheses group at the end of the string
  const match = str.match(/\s*\(([^()]*)\)\s*$/);

  // If there's no trailing parentheses, nothing to remove
  if (!match) {
    return str;
  }

  const fullMatch = match[0]; // e.g. " (Large)"
  const innerText = match[1]; // e.g. "Large"

  // If a key is provided but doesn't match the inner text exactly, leave unchanged
  if (key !== undefined && innerText !== key) {
    return str;
  }

  // Otherwise, strip off the matched segment and trim any extra whitespace
  return str.slice(0, -fullMatch.length).trimEnd();
}
