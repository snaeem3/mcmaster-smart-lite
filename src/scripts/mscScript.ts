import { getAccordionHeaders } from "../msc/filterBar";

// chrome.runtime.sendMessage({ action: "openPopup" });
console.log("Content script running on a whitelisted site.");
(() => {
  const mscTest = () => {
    const title = document.querySelector("h1")?.textContent?.trim(); // Should say "Showing Results For..."
    return title;
  };
  const headers = () => {
    const accordionHeaders = getAccordionHeaders();
    return accordionHeaders;
  };

  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    console.log("msg: ", msg);
    const { type, otherData } = msg;
    let result;
    switch (type) {
      case "TEST":
        result = mscTest();
        break;
      case "HEADERS":
        result = headers();
        console.log("otherData: ", otherData);
        break;
      default:
        console.warn("undefined type received: ", type);
    }
    console.log("mscScript result: ", result);
    // return results to popup
    // Note: Maps can not be passed through response() for some reason
    if (result) response(result);
  });
})();
