import { MSCItem } from "./msc/MSCItem";
import { filterBar } from "./msc/filterBar";

export default async function executeFuncOnURL(
  url: string,
  func: (s?: string) => Partial<MSCItem>[],
  funcArgs?: string,
  type: chrome.windows.createTypeEnum = "popup",
) {
  const window = await chrome.windows.create({
    url: url,
    type: type,
  });

  const result = await executeFuncOnWindow(window, func);
  return result;
}

async function executeFuncOnWindow(
  window: chrome.windows.Window,
  func: (s?: string) => Partial<MSCItem>[],
  funcArgs?: string,
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
    console.log("filterInjectionResults: ", filterInjectionResults);

    const injectionResults = await chrome.scripting.executeScript({
      func: func,
      target: { tabId: tab.id },
      // args: [funcArgs],
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
