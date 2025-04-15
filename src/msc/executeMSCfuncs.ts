import stringSimilarity from "string-similarity-js";
import { McMasterItem } from "../Item";
import { MSCItem } from "./MSCItem";
import waitForTabToLoad from "../utils/waitForTabToLoad";
import {
  preprocessCategoryHeader,
  preprocessCategoryOption,
} from "./preprocessMSC";

interface FeatureMatch {
  mcMasterName: string;
  mcMasterValue: string;
  MSCName: string;
  similarity: number;
}

export default async function executeMSCfuncs(
  url: string,
  mcmasterItem?: Partial<McMasterItem>,
  type: chrome.windows.createTypeEnum = "popup",
  DEBUG: boolean = false,
) {
  const window = await chrome.windows.create({
    url: url,
    type: type,
  });

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
    if (DEBUG) {
      try {
        const mscTEST = await chrome.tabs.sendMessage(tab.id, {
          type: "TEST",
        });

        console.log("mscTEST: ", mscTEST);
      } catch (error) {
        console.error('Error sending "TEST" message: ', error);
      }
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

    let mscItems: Partial<MSCItem>[] = [];

    // Handle search query directly linking to product page
    let isProductPage = false;
    try {
      isProductPage = await chrome.tabs.sendMessage(tab.id, {
        type: "IS_PRODUCT_PAGE",
      });
    } catch (error) {
      console.error('Error sending "IS_PRODUCT_PAGE" message: ', error);
    }
    if (isProductPage) {
      try {
        const mscItem = await chrome.tabs.sendMessage(tab.id, {
          type: "EXTRACT_PRODUCT",
        });
        await chrome.windows.remove(window.id);
        mscItems.push(mscItem);
        return mscItems;
      } catch (error) {
        console.error('Error sending "EXTRACT_PRODUCT" message: ', error);
      }
    }

    //#region Side Bar Filtering
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
    let matches: FeatureMatch[] = [];

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
          `flatMcMasterFeatures['${match.mcMasterName}']: `,
          flatMcMasterFeatures[match.mcMasterName],
        );
        let categoryOptions: string[] = [];
        try {
          categoryOptions = await chrome.tabs.sendMessage(tab.id, {
            type: "CATEGORY_OPTIONS",
            featureCategoryName: match.MSCName,
          });
        } catch (error) {
          console.error("Error sending CATEGORY_OPTIONS: ", error);
        }
        console.log(`${match.MSCName} categoryOptions: `, categoryOptions);
        // Check if any option values match the featureValue
        const THRESHOLD = 0.75;
        let optionsToSelect: string[] = [];

        if (categoryOptions) {
          optionsToSelect = categoryOptions
            .filter((option) => {
              const normalizedOption = preprocessCategoryOption(
                option,
                match.MSCName,
              );
              const optionSimilarity = stringSimilarity(
                normalizedOption,
                match.mcMasterValue,
              );
              if (DEBUG)
                console.log(
                  `${option} -> ${normalizedOption} vs. ${match.mcMasterValue} | ${optionSimilarity}`,
                );
              return optionSimilarity > THRESHOLD;
            })
            // Sort the options by similarity score
            .sort(
              (a, b) =>
                stringSimilarity(b, match.mcMasterValue) -
                stringSimilarity(a, match.mcMasterValue),
            );
        }
        console.log("optionsToSelect: ", optionsToSelect);

        // if a checkbox matches the item feature, click it
        let appliedFilters: string[] = [];
        if (optionsToSelect.length > 0) {
          try {
            appliedFilters = await chrome.tabs.sendMessage(tab.id, {
              type: "APPLY_FILTERS",
              featureCategoryName: match.MSCName,
              optionsToSelect: [optionsToSelect[0]],
            });
            if (appliedFilters.length > 0) await waitForTabToLoad(tab.id);
          } catch (error) {
            console.error("Error sending APPLY_FILTERS: ", error);
          }
        }
        console.log(`${match.MSCName} appliedFilters: `, appliedFilters);
      }
    }
    //#endregion

    //#region Search Result Extraction
    try {
      mscItems = await chrome.tabs.sendMessage(tab.id, {
        type: "EXTRACT_SEARCH_RESULTS",
      });
    } catch (error) {
      console.error("Error sending EXTRACT_SEARCH_RESULTS: ", error);
    }
    console.log(`${mscItems.length} mscItems final: `, mscItems);
    //#endregion

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
  THRESHOLD = 0.9,
  DEBUG = false,
) {
  const mcmasterFeatures = Object.keys(flatFeatures);
  const matchingFeatures: FeatureMatch[] = new Array(mcmasterFeatures.length);
  for (const categoryHeader of categoryHeaders) {
    // Check if any McMaster features match the current MSC feature name
    const likelyFeatures: FeatureMatch[] = [];
    for (const [key, value] of Object.entries(flatFeatures)) {
      const adjustedKey = caseInsensitive ? key.toLowerCase() : key;
      let adjustedCategoryHeader = preprocessCategoryHeader(categoryHeader);
      adjustedCategoryHeader = caseInsensitive
        ? adjustedCategoryHeader.toLowerCase()
        : adjustedCategoryHeader;

      const score = stringSimilarity(adjustedKey, adjustedCategoryHeader);
      if (DEBUG && score > 0)
        console.log(
          `${categoryHeader} --> ${adjustedCategoryHeader} vs. ${key} --> ${adjustedKey} | score: ${score}`,
        );
      if (score > THRESHOLD)
        likelyFeatures.push({
          mcMasterName: key,
          mcMasterValue: value,
          MSCName: categoryHeader,
          similarity: score,
        });
    }

    // Push the most likely feature into the final array at the original index
    if (likelyFeatures.length > 0) {
      const featureToAdd = likelyFeatures.sort(
        (a, b) => b.similarity - a.similarity,
      )[0];
      const index = mcmasterFeatures.indexOf(featureToAdd.mcMasterName);
      // Only add the feature match if it's empty, ensures no overriding
      // TODO - override the existing match if it is better?
      if (!matchingFeatures[index]) matchingFeatures[index] = featureToAdd;
    }
  }
  // Filter out empty/non-matches
  return matchingFeatures.filter(Boolean);
}

/**
 * Appends " (Inch)" to the feature name if the feature value ends with a double quote (").
 *
 * @param {string} featureName - The name of the feature to potentially adjust.
 * @param {string} featureValue - The value of the feature used to determine if adjustment is needed.
 * @returns {string} The adjusted feature name with " (Inch)" appended if the value ends in a double quote, otherwise the original feature name.
 */
function appendInch(featureName: string, featureValue: string) {
  return featureValue[featureValue.length - 1] === '"'
    ? `${featureName} (Inch)`
    : featureName;
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
