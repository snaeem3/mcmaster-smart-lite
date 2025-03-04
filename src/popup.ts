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

const handleButtonClick = async (url = "https://www.mscdirect.com") => {
  const window = await chrome.windows.create({
    url: url,
    type: "popup",
  });

  const tabs = await chrome.tabs.query({ windowId: window.id });
  const tab = tabs[0];
  console.log("hopeful msc tab: ", tab);
  if (tab.id) {
    chrome.scripting.executeScript(
      {
        func: () => {
          document.title = "title changed by executeScript";
          console.log("chrome func"); // this would appear on the msc window console
        },
        target: { tabId: tab.id },
      },
      () => console.log("executeScript callBackFunction called"),
    );
  }

  setTimeout(() => {
    if (window.id) chrome.windows.remove(window.id);
  }, 2000);
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
