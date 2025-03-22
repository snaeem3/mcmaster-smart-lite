import { McMasterItem } from "./Item";
import extractMSCSearchResults from "./msc/extractMSCSearchResults";
import { filterBar, applyCategoryFilter } from "./msc/filterBar";

export default async function executeMSCfuncs(
  url: string,
  mcmasterItem?: Partial<McMasterItem>,
  type: chrome.windows.createTypeEnum = "popup",
) {
  const window = await chrome.windows.create({
    url: url,
    type: type,
  });

  const result = await executeFuncsOnWindow(window, mcmasterItem);
  return result;
}

async function executeFuncsOnWindow(
  window: chrome.windows.Window,
  mcmasterItem?: Partial<McMasterItem>,
) {
  try {
    if (!window.id) {
      throw new Error("Window ID is undefined.");
    }

    const tabs = await chrome.tabs.query({ windowId: window.id });
    const tab = tabs[0];

    if (!tab || !tab.id) {
      throw new Error("Tab or Tab ID is undefined.");
    }

    console.log("hopeful msc tab: ", tab);

    const filterInjectionResults = await chrome.scripting.executeScript({
      func: filterBar,
      target: { tabId: tab.id },
    });
    console.log(
      "filterInjectionResults[0].result: ",
      filterInjectionResults[0].result,
    );

    const accordionHeaders = filterInjectionResults[0].result;
    let matches: string[] = [];
    if (
      accordionHeaders &&
      accordionHeaders.length > 0 &&
      mcmasterItem &&
      mcmasterItem.itemFeatures
    ) {
      matches = getFeatureMatches(
        accordionHeaders.filter(
          (header): header is string => header !== undefined,
        ),
        mcmasterItem,
      );
      console.log(
        `matches between mcmasterItem.itemFeatures and MSC accordionHeaders: `,
        matches,
      );

      // for each match, go through the MSC page and view the available checkbox options
      for (const match of matches) {
        const matchInjectionResults = await chrome.scripting.executeScript({
          func: applyCategoryFilter,
          target: { tabId: tab.id },
          args: [match, mcmasterItem.itemFeatures],
        });
        console.log("matchInjectionResults: ", matchInjectionResults);
      }
      // if a checkbox matches the item feature, click it
    }

    const injectionResults = await chrome.scripting.executeScript({
      func: extractMSCSearchResults,
      target: { tabId: tab.id },
    });

    console.log("injectionResults: ", injectionResults);
    for (const { frameId, result } of injectionResults) {
      console.log(`Frame ${frameId} result:`, result);
    }

    if (window.id) {
      await chrome.windows.remove(window.id);
    }
    return injectionResults;
  } catch (error) {
    console.error("Error in executeScriptOnWindow: ", error);
  }
}

function getFeatureMatches(
  categoryHeaders: string[],
  mcmasterItemFeatures: Pick<Partial<McMasterItem>, "itemFeatures">,
  caseInsensitive: boolean = true,
) {
  const itemFeatures = mcmasterItemFeatures.itemFeatures;
  const validKeys = new Set<string>();

  for (const itemFeature in itemFeatures) {
    const value = itemFeatures[itemFeature];
    if (typeof value === "string") {
      validKeys.add(caseInsensitive ? itemFeature.toLowerCase() : itemFeature);
    } else if (typeof value === "object" && value !== null) {
      // If the value is a nested record, add a composite key for each property.
      for (const subFeature in value) {
        const compositeKey = `${itemFeature} ${subFeature}`;
        validKeys.add(
          caseInsensitive ? compositeKey.toLowerCase() : compositeKey,
        );
      }
    }
  }

  // DEBUG: Show the valid keys we will match against
  // console.log("Valid keys:", Array.from(validKeys));

  return categoryHeaders.filter((categoryHeader) => {
    const checkKey = caseInsensitive
      ? categoryHeader.toLowerCase()
      : categoryHeader;
    const isMatch = validKeys.has(checkKey);

    // DEBUG: Show each item being checked and whether it matched
    // console.log(
    //   `Checking "${categoryHeader}" -> "${checkKey}" | Match: ${isMatch}`,
    // );

    return isMatch;
  });
}
