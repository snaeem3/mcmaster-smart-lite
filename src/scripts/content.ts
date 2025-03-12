import { McMasterItem } from "../Item";
import extractTable from "../extractTable";
chrome.runtime.sendMessage({ action: "openPopup" });
console.log("Content script running on a whitelisted site.");

(() => {
  const scanPage = () => {
    const title = document.querySelector("h1")?.textContent;
    const h3 = document.querySelector("h3")?.textContent;
    const table = document.querySelector("table");
    // TODO: extract price

    const pageObj: Partial<McMasterItem> = {
      primaryName: "",
      secondaryName: "",
    };
    if (title) pageObj.primaryName = title;
    if (h3) pageObj.secondaryName = h3;
    if (table) pageObj.itemFeatures = extractTable(table);

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
