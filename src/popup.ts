import { Item, McMasterItem } from "./Item";
import getActiveTabURL from "./utils/getActiveTabURL";
import createSearchQueries from "./createSearchQueries";
import executeFuncOnURL from "./executeFuncOnURL";
import extractMSCSearchResults from "./msc/extractMSCSearchResults";
import getBestMatchingProduct from "./bestMatchingProduct";

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

  let mcmasterItem: Partial<McMasterItem> = {};
  if (activeTab && activeTab[0].id) {
    try {
      mcmasterItem = await chrome.tabs.sendMessage(activeTab[0].id, {
        type: "SCAN",
      });
      setExtractedInfo(mcmasterItem);
    } catch (error) {
      console.error("Error scanning McMaster page", error);
    }
  }

  // Create search queries from extracted mcmaster data
  const searchQueries = createSearchQueries(mcmasterItem);
  console.log("searchQueries: ", searchQueries.toLocaleString());

  const testURL =
    "https://www.mscdirect.com/browse/tn?rd=k&searchterm=ID+Tag+Cable+Tie";

  const urls = searchQueries.map(
    (searchQuery) =>
      `https://www.mscdirect.com/browse/tn?rd=k&${searchQuery.toString()}`,
  );

  // TODO: Add try-catch below?
  // Execute MSC scripts using created search queries
  const windowResults = await Promise.all(
    urls.map((url) => executeFuncOnURL(url, extractMSCSearchResults)),
  );
  console.log(windowResults);

  const searchResults = windowResults
    .filter((windowResult) => windowResult !== undefined)
    .map((windowResult) => windowResult[0].result);

  console.log("searchResults: ", searchResults);

  for (const searchResult of searchResults) {
    if (searchResult === undefined) continue;
    const { bestProduct, score, error } = getBestMatchingProduct(
      mcmasterItem,
      searchResult,
      0.2,
    );
    if (error) console.error(error);
    else {
      console.log("bestProduct: ", bestProduct);
      console.log("score: ", score);
    }
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
