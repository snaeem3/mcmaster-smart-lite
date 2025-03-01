import Item from "./Item";
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

const handleButtonClick = async () => {
  const activeTab = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  console.log("activeTab: ", activeTab);
  if (activeTab && activeTab[0].id) {
    chrome.tabs.sendMessage(
      activeTab[0].id,
      { type: "SCAN" },
      (pageObj: Partial<Item>) => setExtractedInfo(pageObj),
    );
  }
  alert("Button clicked!");
};

if (clickMeButton) {
  clickMeButton.addEventListener("click", handleButtonClick);
}

if (itemTitle) {
  itemTitle.textContent = "test";

  getActiveTabURL().then((activeTab) => {
    if (activeTab && activeTab.url) {
      itemTitle.textContent = activeTab.url;
    }
  });
}
