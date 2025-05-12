import extractTable from "../extractTable";

export default function extractMSCProductPage(
  productDetailsQuery = ".pdp-details-container",
): Record<string, string | Record<string, string>> {
  const primaryName = document.querySelector("h1")?.textContent?.trim();
  const productDetailsContainer = document.querySelector(productDetailsQuery);
  if (!productDetailsContainer)
    throw new Error(
      `Product Details Container not found with query ${productDetailsQuery}`,
    );

  const tablesNodeList = productDetailsContainer.querySelectorAll("table");
  if (!tablesNodeList) throw new Error("No tables found");

  const tables = [...tablesNodeList];
  const results = tables.map((table) => extractTable(table));
  const mscItem = Object.assign({}, ...results); // Assuming MSC has no nested tables. Would need to be rewritten with a deep merge if so
  const url = window.location.href;
  mscItem.url = url;
  mscItem.primaryName = primaryName;
  return mscItem;
}
