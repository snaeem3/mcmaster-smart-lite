export default function extractTable(table: HTMLTableElement) {
  const result = new Map<string, string | Map<string, string>>();
  let tempMap = new Map<string, string>();
  let tempSubTableName = "";

  for (let i = 0; i < table.rows.length; i++) {
    const tableRow = table.rows[i];
    const key = tableRow.cells[0].textContent?.trim();
    const value = tableRow.cells[1].textContent?.trim();
    const isIndented = containsPhrase(tableRow);

    if (isIndented && key && value) {
      // If this row is indented just add it to tempMap
      tempMap.set(key, value);
    } else if (!isIndented && key) {
      // This row is not part of a sub table
      if (tempMap.size > 0) {
        // add current sub table to result if there is one
        result.set(tempSubTableName, tempMap);
        tempMap = new Map<string, string>();
      }
      tempSubTableName = key;
      if (value) result.set(key, value);
    }
  }
  if (tempMap.size > 0) {
    result.set(tempSubTableName, tempMap);
  }

  return result;
}

function containsPhrase(row: HTMLTableRowElement, phrase: string = "indent") {
  return Array.from(row.classList).some((className) =>
    className.includes(phrase),
  );
}
