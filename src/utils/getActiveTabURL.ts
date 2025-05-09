export default async function getActiveTabURL() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions); // REQUIRES PERMISSIONS IN manifest.json
  return tab;
}
