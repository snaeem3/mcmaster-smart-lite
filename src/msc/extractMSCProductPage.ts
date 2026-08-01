import extractMscTable from "./extractMscTable";
import { MSCItem } from "./MSCItem";

export default function extractMSCProductPage(
  primaryNameSelector = "h1",
  productDetailsQuery = "#specs-table-wrapper",
): Partial<MSCItem> {
  const primaryName =
    document.querySelector(primaryNameSelector)?.textContent?.trim() ?? "";
  const productDetailsContainer = document.querySelector(productDetailsQuery);
  if (!productDetailsContainer)
    throw new Error(
      `Product Details Container not found with query ${productDetailsQuery}`,
    );
  const mscId = getMscPartNumber() ?? "";

  const table = productDetailsContainer.querySelector("table");
  if (!table) throw new Error("No table found");
  const itemFeatures = extractMscTable(table);
  const url = window.location.href;

  const mscItem: Partial<MSCItem> = {
    itemFeatures,
    primaryName,
    url,
    mscId,
  };
  return mscItem;
}

function getMscPartNumber(
  element: HTMLElement | Document = document,
  precedingText = "MSC#",
): string | null {
  const cells = Array.from(element.querySelectorAll("td"));

  const labelCell = cells.find(
    (td) => td.textContent?.trim() === precedingText,
  );

  if (!labelCell) {
    return null;
  }

  const valueCell = labelCell.nextElementSibling;

  if (!(valueCell instanceof HTMLTableCellElement)) {
    return null;
  }

  return valueCell.textContent?.trim() ?? null;
}
