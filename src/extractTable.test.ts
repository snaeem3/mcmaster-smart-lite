import { beforeEach, expect, test } from "vitest";
import extractTable from "./extractTable";

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

  // const expectedResult = new Map();
  // expectedResult.set("Length", '8"');
  // expect(extractTable(table)).toEqual(expectedResult);
  expect(extractTable(table)).toEqual({
    Length: '8"',
  });
});

test("Reads a subtable noted with 'indented' in the className", () => {
  tableRow.appendChild(td1);
  tableRow.appendChild(td2);
  tableBody.appendChild(tableRow);

  const tableRow2 = document.createElement("tr");
  const tableRow3 = document.createElement("tr");
  const tableRow4 = document.createElement("tr");
  const tableRow5 = document.createElement("tr");
  const td3 = document.createElement("td");
  const td4 = document.createElement("td");
  const td5 = document.createElement("td");
  const td6 = document.createElement("td");
  const td7 = document.createElement("td");
  const td8 = document.createElement("td");
  const td9 = document.createElement("td");
  const td10 = document.createElement("td");

  td3.textContent = "Tag";
  td4.textContent = "";
  td5.textContent = "Length";
  td6.textContent = '1"';
  td7.textContent = "Width";
  td8.textContent = '1 1/8"';
  td9.textContent = "Material";
  td10.textContent = "Nylon Plastic";

  tableRow3.className = "indented";
  tableRow4.className = "-indented_";

  tableRow2.appendChild(td3);
  tableRow2.appendChild(td4);
  tableRow3.appendChild(td5);
  tableRow3.appendChild(td6);
  tableRow4.appendChild(td7);
  tableRow4.appendChild(td8);
  tableRow5.appendChild(td9);
  tableRow5.appendChild(td10);
  tableBody.appendChild(tableRow2);
  tableBody.appendChild(tableRow3);
  tableBody.appendChild(tableRow4);
  tableBody.appendChild(tableRow5);
  table.appendChild(tableBody);

  // const expectedResult = new Map();
  // const expectedSubTable = new Map();
  // expectedResult.set("Length", '8"');
  // expectedSubTable.set("Length", '1"');
  // expectedSubTable.set("Width", '1 1/8"');
  // expectedResult.set("Tag", expectedSubTable);
  // expectedResult.set("Material", "Nylon Plastic");
  // expect(extractTable(table)).toEqual(expectedResult);
  expect(extractTable(table)).toEqual({
    Length: '8"',
    Tag: { Length: '1"', Width: '1 1/8"' },
    Material: "Nylon Plastic",
  });
});
