// import { Price } from "../Item";
import { MSCItem } from "./MSCItem";

export default function extractMSCSearchResults(
  querySelector = "#ListSearchResults",
) {
  const MSCsearchResults = document.querySelector(querySelector);
  if (!(MSCsearchResults instanceof HTMLDivElement))
    throw new Error(`${querySelector} is an invalid querySelector`);
  try {
    return extractSearchResults(MSCsearchResults);
  } catch (error) {
    console.error(error);
    throw new Error("Error obtaining MSCsearchResult");
  }

  /**
   * Extracts search results from an MSC search result div
   * @param {HTMLDivElement} ListSearchResults - A div where each child node is a search result item. id="ListSearchResults" in DOM
   *
   */
  function extractSearchResults(ListSearchResults: HTMLDivElement) {
    const searchResults: Partial<MSCItem>[] = [];
    const searchResultHTMLCollection = ListSearchResults.children;
    for (let i = 0; i < searchResultHTMLCollection.length; i++) {
      const searchResultDiv = searchResultHTMLCollection[i];
      const mscItem = extractSearchResult(searchResultDiv);
      searchResults.push(mscItem);
    }

    return searchResults;
  }

  function extractSearchResult(searchResultDiv: Element | HTMLDivElement) {
    const productDescriptionDiv = searchResultDiv.querySelector(".productDesc");
    const productDescriptionTexts =
      productDescriptionDiv?.querySelectorAll("p");

    const manufacturerText =
      productDescriptionTexts && productDescriptionTexts[0].textContent?.trim();
    const primaryDescText =
      productDescriptionTexts && productDescriptionTexts[1].textContent?.trim();
    const secondaryDescText =
      productDescriptionTexts && productDescriptionTexts[2].textContent?.trim();
    const inStockText =
      productDescriptionTexts && productDescriptionTexts[3].textContent?.trim();

    const mscItem: Partial<MSCItem> = {};
    if (typeof primaryDescText === "string") {
      const { primaryName, desc } = extractPrimaryNameAndDesc(primaryDescText);
      mscItem.primaryName = primaryName;
      mscItem.description = desc;
    }
    if (typeof manufacturerText === "string")
      mscItem.manufacturer = manufacturerText;
    if (typeof secondaryDescText === "string")
      mscItem.secondaryName = secondaryDescText;
    // TODO: determine inStock status from inStockText

    const dataPrice = searchResultDiv.getAttribute("data-price");
    const dataPricingUnit = searchResultDiv.getAttribute("data-pricing-unit");
    if (dataPrice) mscItem.totalPrice = parseFloat(dataPrice);
    if (dataPricingUnit) mscItem.packageQuantity = parseInt(dataPricingUnit);

    const productLink = productDescriptionDiv?.querySelector("a")?.href;
    if (productLink) {
      // const productURL = new URL(productLink, "https://mscdirect.com/");
      mscItem.url = productLink;
    }

    return mscItem;
  }

  // TODO: write unit tests for this function
  // Assume the primary name of an MSC item to be all text before the first ':' or ';'
  function extractPrimaryNameAndDesc(primaryDescText: string) {
    let firstDescriptionSeparator;
    try {
      firstDescriptionSeparator = checkSemicolonVsColon(primaryDescText);
    } catch (error) {
      console.warn(error);
      return { primaryName: primaryDescText, desc: "" };
    }
    let splitPrimaryDescText: string[];
    if (firstDescriptionSeparator == ";") {
      splitPrimaryDescText = primaryDescText.split(";");
    } else {
      splitPrimaryDescText = primaryDescText.split(":");
    }

    const [primaryName, ...desc] = splitPrimaryDescText;

    return { primaryName, desc: desc.join(firstDescriptionSeparator) };
  }

  // Helper function to analyze MSC description title for ';' or ':'
  function checkSemicolonVsColon(inputString: string) {
    // Find the indices of the first semicolon and first colon
    const semicolonIndex = inputString.indexOf(";");
    const colonIndex = inputString.indexOf(":");

    // If neither character exists
    if (semicolonIndex === -1 && colonIndex === -1) {
      throw new Error("Neither semicolon nor colon found in the input string");
    }

    if (colonIndex === -1) {
      return ";";
    }

    if (semicolonIndex === -1) {
      return ":";
    }

    return semicolonIndex < colonIndex ? ";" : ":";
  }
}
