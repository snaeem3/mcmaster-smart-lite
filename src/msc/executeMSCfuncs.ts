import stringSimilarity from "string-similarity-js";
import { McMasterItem } from "../Item";
import waitForTabToLoad from "../utils/waitForTabToLoad";
import { MSCItem } from "./MSCItem";

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
    console.log("tab.id: ", tab.id);
    await waitForTabToLoad(tab.id);
    try {
      const mscTEST = await chrome.tabs.sendMessage(tab.id, {
        type: "TEST",
      });

      console.log("mscTEST: ", mscTEST);
    } catch (error) {
      console.error('Error sending "TEST" message: ', error);
    }

    // Handle 0 results found page
    let hasResults = true;
    try {
      hasResults = await chrome.tabs.sendMessage(tab.id, {
        type: "HAS_RESULTS",
      });
    } catch (error) {
      console.error('Error sending "HAS_RESULTS" message: ', error);
    }
    if (!hasResults) {
      console.log("0 results found");
      await chrome.windows.remove(window.id);
      return [];
    }

    let accordionHeaders: string[] = [];
    try {
      accordionHeaders = await chrome.tabs.sendMessage(tab.id, {
        type: "HEADERS",
        otherData: "---testing other data----",
      });
    } catch (error) {
      console.error("Error sending HEADERS: ", error);
    }
    console.log("accordionHeaders: ", accordionHeaders);

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
        let categoryOptions: string[] = [];
        try {
          categoryOptions = await chrome.tabs.sendMessage(tab.id, {
            type: "CATEGORY_OPTIONS",
            featureCategoryName: match,
          });
        } catch (error) {
          console.error("Error sending CATEGORY_OPTIONS: ", error);
        }
        console.log(`${match} categoryOptions: `, categoryOptions);
        // Check if any option values match the featureValue
        const THRESHOLD = 0.5;
        let optionsToSelect: string[] = [];

        if (categoryOptions) {
          // Sort the options by similarity score
          optionsToSelect = categoryOptions
            .filter(
              (option) =>
                stringSimilarity(option, flatMcMasterFeatures[match]) >
                THRESHOLD,
            )
            .sort(
              (a, b) =>
                stringSimilarity(b, flatMcMasterFeatures[match]) -
                stringSimilarity(a, flatMcMasterFeatures[match]),
            );
        }
        console.log("optionsToSelect: ", optionsToSelect);

        // if a checkbox matches the item feature, click it
        let appliedFilters: string[] = [];
        try {
          appliedFilters = await chrome.tabs.sendMessage(tab.id, {
            type: "APPLY_FILTERS",
            featureCategoryName: match,
            optionsToSelect: [optionsToSelect[0]],
          });
        } catch (error) {
          console.error("Error sending APPLY_FILTERS: ", error);
        }
        console.log(`${match} appliedFilters: `, appliedFilters);
      }
    }

    await waitForTabToLoad(tab.id);
    let mscItems: Partial<MSCItem>[] = [];
    try {
      mscItems = await chrome.tabs.sendMessage(tab.id, {
        type: "EXTRACT",
      });
    } catch (error) {
      console.error("Error sending EXTRACT: ", error);
    }
    console.log(`${mscItems.length} mscItems final: `, mscItems);

    await chrome.windows.remove(window.id);

    return mscItems;
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
