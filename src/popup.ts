import { Item, McMasterItem } from "./Item";
import extractMSCSearchResults from "./msc/extractMSCSearchResults";
import getActiveTabURL from "./utils/getActiveTabURL";
import executeFuncOnWindow from "./executeFuncOnWindow";

const clickMeButton = document.getElementById("clickMe");
const itemTitle = document.getElementById("item-title");
// const itemInfo = document.getElementById("item-info");

const setTitle = (title: string) => {
  if (itemTitle) itemTitle.textContent = title;
};

const setExtractedInfo = (productMap: Partial<Item>) => {
  if (productMap.primaryName) setTitle(productMap.primaryName);
};

const handleButtonClick = async () => {
  const activeTab = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  console.log("activeTab: ", activeTab);

  let pageObj: Partial<McMasterItem>;
  if (activeTab && activeTab[0].id) {
    try {
      pageObj = await chrome.tabs.sendMessage(activeTab[0].id, {
        type: "SCAN",
      });
      setExtractedInfo(pageObj);
    } catch (error) {
      console.error("Error scanning McMaster page", error);
    }
  }

  // Create search queries from extracted mcmaster data

  // Execute MSC scripts using created search queries

  const url =
    "https://www.mscdirect.com/browse/tn?rd=k&searchterm=ID+Tag+Cable+Tie";

  const window = await chrome.windows.create({
    url: url,
    type: "popup",
  });

  const windowResults = await executeFuncOnWindow(
    window,
    extractMSCSearchResults,
  );
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
