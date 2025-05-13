import extractTable from "../extractTable";
import { MSCItem } from "./MSCItem";

export default function extractMSCProductPage(
  productDetailsQuery = ".pdp-details-container",
  mscPartNumberQuery = "#basePartNumber",
  mscPartNumberAttribute = "data-partnumber",
): Partial<MSCItem> {
  const primaryName = document.querySelector("h1")?.textContent?.trim() ?? "";
  const productDetailsContainer = document.querySelector(productDetailsQuery);
  if (!productDetailsContainer)
    throw new Error(
      `Product Details Container not found with query ${productDetailsQuery}`,
    );
  const mscPartNumberElement = document.querySelector(mscPartNumberQuery);
  const mscId =
    mscPartNumberElement?.getAttribute(mscPartNumberAttribute) ?? "";

  const table = productDetailsContainer.querySelector("table");
  if (!table) throw new Error("No table found");
  // Assuming MSC has no nested tables. Would need to be rewritten with a deep merge if so
  const itemFeatures = extractTable(table);
  const url = window.location.href;

  const mscItem: Partial<MSCItem> = {
    itemFeatures,
    primaryName,
    url,
    mscId,
  };
  return mscItem;
}
