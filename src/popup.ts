import { Item, McMasterItem } from "./Item";
import getActiveTabURL from "./utils/getActiveTabURL";
import createSearchQueries from "./createSearchQueries";
import executeMSCfuncs from "./executeMSCfuncs";
import getBestMatchingProduct from "./bestMatchingProduct";
import { MSCItem } from "./msc/MSCItem";

const clickMeButton = document.getElementById("clickMe");
const itemTitle = document.getElementById("item-title");
// const itemInfo = document.getElementById("item-info");
const matchList = document.getElementById("match-list");
const bestMatchProductListItem = matchList?.querySelector(
  "#best-match-product",
);
const bestMatchProductA = bestMatchProductListItem?.querySelector("a");
const bestMatchProductTitle = bestMatchProductListItem?.querySelector("h4");
const bestMatchProductP = bestMatchProductListItem?.querySelector("p");

const setTitle = (title: string) => {
  if (itemTitle) itemTitle.textContent = title;
};

const setExtractedInfo = (productMap: Partial<Item>) => {
  if (productMap.primaryName) setTitle(productMap.primaryName);
};

const setBestMatchedProduct = (mscItem: Partial<MSCItem>, score: number) => {
  if (bestMatchProductTitle && mscItem.primaryName)
    bestMatchProductTitle.textContent = mscItem.primaryName;

  if (bestMatchProductA && mscItem.url)
    bestMatchProductA.href = mscItem.url.toString();

  if (bestMatchProductP)
    bestMatchProductP.textContent = `Match: ${Math.round((score + Number.EPSILON) * 100) / 100}`;
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
    urls.map((url) => executeMSCfuncs(url, mcmasterItem)),
  );
  console.log("windowResults: ", windowResults);

  for (const windowResult of windowResults) {
    if (windowResult === undefined) continue;
    const { bestProduct, score, error } = getBestMatchingProduct(
      mcmasterItem,
      windowResult,
      0.2,
    );
    if (error) console.error(error);
    else if (bestProduct) {
      console.log("bestProduct: ", bestProduct);
      console.log("score: ", score);
      setBestMatchedProduct(bestProduct, score);
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
