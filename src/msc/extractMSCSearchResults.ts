import MSCItem from "./MSCItem";

export default function extractMSCSearchResults(
  querySelector = "#ListSearchResults",
) {
  try {
    const MSCsearchResults = document.querySelector(querySelector);
    if (MSCsearchResults instanceof HTMLDivElement)
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
    if (typeof manufacturerText === "string")
      mscItem.manufacturer = manufacturerText;
    if (typeof primaryDescText === "string")
      mscItem.primaryName = extractPrimaryName(primaryDescText);
    if (typeof secondaryDescText === "string")
      mscItem.secondaryName = secondaryDescText;
    // TODO: determine inStock status from inStockText

    return mscItem;
  }

  // TODO: write unit tests for this function
  // Assume the primary name of an MSC item to be all text before the first ':' or ';'
  function extractPrimaryName(primaryDescText: string) {
    let firstDescriptionSeparator;
    try {
      firstDescriptionSeparator = checkSemicolonVsColon(primaryDescText);
    } catch (error) {
      console.warn(error);
      return primaryDescText;
    }
    let splitPrimaryDescText: string[];
    if (firstDescriptionSeparator == ";") {
      splitPrimaryDescText = primaryDescText.split(";");
    } else {
      splitPrimaryDescText = primaryDescText.split(":");
    }

    return splitPrimaryDescText[0];
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
