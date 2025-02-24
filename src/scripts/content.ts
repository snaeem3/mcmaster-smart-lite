chrome.runtime.sendMessage({ action: "openPopup" });
console.log("Content script running on a whitelisted site.");

(() => {
  const scanPage = () => {
    const title = document.querySelector("h1")?.textContent;
    return title ? title : "no title found";
  };

  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    const { type } = msg;
    if (type === "SCAN") response(scanPage());
  });
})();
