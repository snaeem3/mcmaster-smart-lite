import { beforeEach, expect, test } from "vitest";
import scanTable from "./scanTable";

let container: HTMLDivElement;
let table: HTMLTableElement;
let tableBody: HTMLTableSectionElement;
let tableRow: HTMLTableRowElement;
let td1: HTMLTableCellElement;
let td2: HTMLTableCellElement;

beforeEach(() => {
  container = document.createElement("div");
  container.id = "test-container";
  document.body.appendChild(container);

  table = document.createElement("table");
  tableBody = document.createElement("tbody");
  tableRow = document.createElement("tr");
  td1 = document.createElement("td");
  td2 = document.createElement("td");

  td1.textContent = "Length";
  td2.textContent = '8"';
});

test("use jsdom in this test file", () => {
  const element = document.createElement("div");
  expect(element).not.toBeNull();
});

test("Reads a single row", () => {
  tableRow.appendChild(td1);
  tableRow.appendChild(td2);
  tableBody.appendChild(tableRow);
  table.appendChild(tableBody);

  expect(scanTable(table)).toEqual({ Length: '8"' });
});
