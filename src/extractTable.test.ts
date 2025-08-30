import { expect, test } from "vitest";
import extractTable from "./extractTable";
import createTableFromHtml from "./utils/createTableFromHtml";

test("use jsdom in this test file", () => {
  const element = document.createElement("div");
  expect(element).not.toBeNull();
});

test("Reads a single row", () => {
  const table = createTableFromHtml(/*html*/ `
    <table>
      <tbody>
        <tr>
          <td>Length</td>
          <td>8"</td>
        </tr>
      </tbody>
    </table>
  `);

  expect(extractTable(table)).toEqual({
    Length: '8"',
  });
});

test("Reads a subtable noted with 'indented' in the className", () => {
  const table = createTableFromHtml(/*html*/ `
    <table>
      <tbody>
        <tr>
          <td>Length</td>
          <td>8"</td>
        </tr>
        <tr>
          <td>Tag</td>
          <td></td>
        </tr>
        <tr class="indented">
          <td>Length</td>
          <td>1"</td>
        </tr>
        <tr class="-indented_">
          <td>Width</td>
          <td>1 1/8"</td>
        </tr>
        <tr>
          <td>Material</td>
          <td>Nylon Plastic</td>
        </tr>
      </tbody>
    </table>
  `);

  expect(extractTable(table)).toEqual({
    Length: '8"',
    Tag: { Length: '1"', Width: '1 1/8"' },
    Material: "Nylon Plastic",
  });
});
