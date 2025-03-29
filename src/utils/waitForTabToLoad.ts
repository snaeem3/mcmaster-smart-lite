export default async function waitForTabToLoad(tabId: number): Promise<void> {
  return new Promise((resolve) => {
    chrome.tabs.onUpdated.addListener(
      function listener(updatedTabId, changeInfo) {
        if (updatedTabId === tabId && changeInfo.status === "complete") {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      },
    );
  });
}
