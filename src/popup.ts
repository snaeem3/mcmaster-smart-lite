import getActiveTabURL from "./utils/getActiveTabURL";

const clickMeButton = document.getElementById("clickMe");
const itemTitle = document.getElementById("item-title");
// const itemInfo = document.getElementById("item-info");

const setTitle = (title: string) => {
  if (itemTitle) itemTitle.textContent = title;
};

if (clickMeButton) {
  clickMeButton.addEventListener("click", () => {
    getActiveTabURL().then((activeTab) => {
      console.log("activeTab: ", activeTab);
      if (activeTab && activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, { type: "SCAN" }, setTitle);
      }
    });
    alert("Button clicked!");
  });
}

if (itemTitle) {
  itemTitle.textContent = "test";

  getActiveTabURL().then((activeTab) => {
    console.log("activeTab: ", activeTab);
    if (activeTab && activeTab.url) {
      itemTitle.textContent = activeTab.url;
    }
  });
}
