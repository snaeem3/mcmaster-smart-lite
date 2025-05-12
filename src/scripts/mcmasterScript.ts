import { McMasterItem } from "../Item";
import extractTable from "../extractTable";
chrome.runtime.sendMessage({ action: "openPopup" });
console.log("Content script running on a whitelisted site.");

(() => {
  function getBetweenLastTwoSlashes(str: string) {
    const lastSlash = str.lastIndexOf("/");
    const secondLastSlash = str.lastIndexOf("/", lastSlash - 1);
    return str.substring(secondLastSlash + 1, lastSlash);
  }

  const scanPage = () => {
    const title = document.querySelector("h1")?.textContent;
    const h3 = document.querySelector("h3")?.textContent;
    const tables = [...document.querySelectorAll("table")];
    const currentUrl = window.location.href;
    // TODO: extract price

    const pageObj: Partial<McMasterItem> = {
      primaryName: "",
      secondaryName: "",
    };
    if (title) pageObj.primaryName = title;
    if (h3) pageObj.secondaryName = h3;

    pageObj.mcMasterId = getBetweenLastTwoSlashes(currentUrl);

    if (tables.length === 1) pageObj.itemFeatures = extractTable(tables[0]);
    else {
      const productDetailTable = tables.find((table) =>
        table.className.includes("ProductDetail"),
      );
      if (!productDetailTable) {
        console.log("ProductDetail table not found- using last table on page");
        pageObj.itemFeatures = extractTable(tables[tables.length - 1]);
      } else pageObj.itemFeatures = extractTable(productDetailTable);
    }

    return pageObj;
  };

  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    const { type } = msg;
    let result;
    if (type === "SCAN") result = scanPage();
    console.log("result: ", result);
    // return results to popup
    // Note: Maps can not be passed through response() for some reason
    if (result) response(result);
  });
})();
