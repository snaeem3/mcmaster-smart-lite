import Item from "./Item";
import extractMSCSearchResults from "./msc/extractMSCSearchResults";
import getActiveTabURL from "./utils/getActiveTabURL";

const clickMeButton = document.getElementById("clickMe");
const itemTitle = document.getElementById("item-title");
// const itemInfo = document.getElementById("item-info");

const setTitle = (title: string) => {
  if (itemTitle) itemTitle.textContent = title;
};

const setExtractedInfo = (productMap: Partial<Item>) => {
  if (productMap.primaryName) setTitle(productMap.primaryName);
};

const handleButtonClick = async (
  url = "https://www.mscdirect.com/browse/tn?rd=k&searchterm=ID+Tag+Cable+Tie",
) => {
  const window = await chrome.windows.create({
    url: url,
    type: "popup",
  });

  const tabs = await chrome.tabs.query({ windowId: window.id });
  const tab = tabs[0];
  console.log("hopeful msc tab: ", tab);

  if (tab.id) {
    chrome.scripting
      .executeScript(
        {
          func: extractMSCSearchResults,
          target: { tabId: tab.id },
        },
        // (results) => console.log("results: ", results),
      )
      .then((injectionResults) => {
        for (const { frameId, result } of injectionResults) {
          console.log(`Frame ${frameId} result:`, result);
        }
        if (window.id) chrome.windows.remove(window.id);
      });
  }
};

if (clickMeButton) {
  clickMeButton.addEventListener("click", () => handleButtonClick());
}

if (itemTitle) {
  itemTitle.textContent = "test";

  getActiveTabURL().then((activeTab) => {
    if (activeTab && activeTab.url) {
      itemTitle.textContent = activeTab.url;
    }
  });
}
