import { McMasterItem } from "./Item";
import extractMSCSearchResults from "./msc/extractMSCSearchResults";
import { getAccordionHeaders, applyCategoryFilter } from "./msc/filterBar";

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

    const accordionHeaderInjectionResults =
      await chrome.scripting.executeScript({
        func: getAccordionHeaders,
        target: { tabId: tab.id },
      });
    console.log(
      "accordionHeaderInjectionResults[0].result: ",
      accordionHeaderInjectionResults[0].result,
    );
    const accordionHeaders = accordionHeaderInjectionResults[0].result;

    const flatMcMasterFeatures = mcmasterItem?.itemFeatures
      ? flattenRecord(mcmasterItem?.itemFeatures)
      : {};
    let matches: string[] = [];

    if (accordionHeaders && accordionHeaders.length > 0) {
      matches = getFeatureMatches(
        accordionHeaders.filter(
          (header): header is string => header !== undefined,
        ),
        flatMcMasterFeatures,
      );
      console.log(
        `matches between flatMcMasterFeatures and MSC accordionHeaders: `,
        matches,
      );

      // for each match, go through the MSC page and view the available checkbox options
      for (const match of matches) {
        console.log("match: ", match);
        console.log(
          `flatMcMasterFeatures['${match}']: `,
          flatMcMasterFeatures[match],
        );
        const matchInjectionResults = await chrome.scripting.executeScript({
          func: applyCategoryFilter,
          target: { tabId: tab.id },
          args: [match, flatMcMasterFeatures[match]],
        });
        console.log(
          `${match} matchInjectionResults[0]: `,
          matchInjectionResults[0],
        );
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

//#region Helper Functions
function getFeatureMatches(
  categoryHeaders: string[],
  flatFeatures: Record<string, string>,
  caseInsensitive: boolean = true,
) {
  const validKeys = new Set<string>();

  for (const feature in flatFeatures) {
    validKeys.add(caseInsensitive ? feature.toLowerCase() : feature);
  }

  // DEBUG: Show the valid keys we will match against
  // console.log("Valid keys:", Array.from(validKeys));

  return categoryHeaders.filter((categoryHeader) => {
    // TODO: Currently looking for an exact match, should check for match above given threshold
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

function flattenRecord(
  input: Record<string, string | Record<string, string>>,
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string") {
      result[key] = value;
    } else {
      // It's a nested record
      for (const [subKey, subValue] of Object.entries(value)) {
        const newKey = `${key} ${subKey}`;
        result[newKey] = subValue;
      }
    }
  }

  return result;
}
