import {
  applyFilters,
  getAccordionHeaders,
  getCategoryOptions,
} from "../msc/filterBar";
import extractMSCProductPage from "../msc/extractMSCProductPage";
import extractMSCSearchResults from "../msc/extractMSCSearchResults";

// chrome.runtime.sendMessage({ action: "openPopup" });
console.log("Content script running on a whitelisted site.");
(() => {
  const mscTest = () => {
    const title = document.querySelector("h1")?.textContent?.trim(); // Should say "Showing Results For..."
    return title;
  };

  const hasResults = (
    querySelector = "main div",
    noResultsText = "Sorry, we couldn't find",
  ) => {
    const mainDivs = [...document.querySelectorAll(querySelector)];
    if (mainDivs.some((div) => div.textContent?.includes(noResultsText)))
      return false;
    return true;
  };

  const isProductPage = (productPageQuery = "#pdp-new-product-details") => {
    return document.querySelector(productPageQuery);
  };

  const headers = () => {
    const accordionHeaders = getAccordionHeaders();
    return accordionHeaders;
  };

  const categoryOptions = (featureCategoryName: string) => {
    const categoryOptions = getCategoryOptions(featureCategoryName);
    return categoryOptions;
  };

  chrome.runtime.onMessage.addListener((msg, sender, response) => {
    console.log("msg: ", msg);
    const { type, otherData, featureCategoryName, optionsToSelect } = msg;
    let result;
    switch (type) {
      case "TEST":
        result = mscTest();
        break;
      case "HAS_RESULTS":
        result = hasResults();
        break;
      case "IS_PRODUCT_PAGE":
        result = isProductPage();
        break;
      case "EXTRACT_PRODUCT":
        result = extractMSCProductPage();
        break;
      case "HEADERS":
        result = headers();
        console.log("otherData: ", otherData);
        break;
      case "CATEGORY_OPTIONS":
        result = categoryOptions(featureCategoryName);
        break;
      case "APPLY_FILTERS":
        result = applyFilters(featureCategoryName, optionsToSelect);
        break;
      case "EXTRACT_SEARCH_RESULTS":
        result = extractMSCSearchResults();
        break;
      default:
        console.log("undefined type received: ", type);
    }
    console.log("mscScript result: ", result);
    // return results to popup
    // Note: Maps can not be passed through response() for some reason
    if (result) response(result);
  });
})();
