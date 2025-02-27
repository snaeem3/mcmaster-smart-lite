import Item, { ItemFeature, Price } from "../Item";
import extractTable from "../extractTable";
chrome.runtime.sendMessage({ action: "openPopup" });
console.log("Content script running on a whitelisted site.");

(() => {
  const scanPage = () => {
    const title = document.querySelector("h1")?.textContent;
    const table = document.querySelector("table");

    const pageMap = new Map();
    pageMap.set("Title", title);
    if (table) pageMap.set("Item Features", extractTable(table));
    console.log("pageMap");
    console.table(pageMap);
    return pageMap;
  };

  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    const { type } = msg;
    let result;
    if (type === "SCAN") result = scanPage();
    console.log("result: ", result);
    // return results to popup
    // Note: Maps can not be passed through response() for some reason
    // Convert Map --> Object before sending
    if (result) response(Object.fromEntries(result));
  });
})();
