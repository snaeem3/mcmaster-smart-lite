export default function extractMscTable(table: HTMLTableElement) {
  const result: Record<string, string | Record<string, string>> = {};
  for (const tableRow of table.rows) {
    for (const td of tableRow.querySelectorAll<HTMLTableCellElement>("td")) {
      const key = td.id;
      const value = td.dataset.value;

      if (key && value !== undefined) {
        result[key] = value;
      }
    }
  }
  return result;
}
