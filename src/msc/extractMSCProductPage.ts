import extractTable from "../extractTable";

export default function extractMSCProductPage(
  productDetailsQuery = ".pdp-details-container",
): Record<string, string | Record<string, string>> {
  const productDetailsContainer = document.querySelector(productDetailsQuery);
  if (!productDetailsContainer)
    throw new Error(
      `Product Details Container not found with query ${productDetailsQuery}`,
    );

  const tablesNodeList = productDetailsContainer.querySelectorAll("table");
  if (!tablesNodeList) throw new Error("No tables found");

  const tables = [...tablesNodeList];
  const results = tables.map((table) => extractTable(table));
  return Object.assign({}, ...results); // Assuming MSC has no nested tables. Would need to be rewritten with a deep merge if so
}
