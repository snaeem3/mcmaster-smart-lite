export default function scanTable(table: HTMLTableElement) {
  const result: Record<string, string> = {};

  for (let i = 0; i < table.rows.length; i++) {
    const tableRow = table.rows[i];
    const key = tableRow.cells[0].textContent;
    const value = tableRow.cells[1].textContent;
    if (key && value) result[key] = value;
  }

  return result;
}
