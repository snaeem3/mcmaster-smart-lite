// chrome.runtime.sendMessage({ action: "openPopup" });
console.log("Content script running on a whitelisted site.");
(() => {
  const mscTest = () => {
    const title = document.querySelector("h1")?.textContent?.trim(); // Should say "Showing Results For..."
    return title;
  };

  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    const { type } = msg;
    let result;
    if (type === "TEST") result = mscTest();
    else console.log("type: ", type);
    console.log("mscScript result: ", result);
    // return results to popup
    // Note: Maps can not be passed through response() for some reason
    if (result) response(result);
  });
})();
