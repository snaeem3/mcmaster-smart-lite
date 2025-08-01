export function getAccordionHeaders(
  filterBaryQuery = "#filter-bar",
  headerQuery = ".accordionHeader",
) {
  const filterBar = document.querySelector(filterBaryQuery) as HTMLDivElement;
  const accordionHeadersNodeList = filterBar.querySelectorAll(headerQuery);
  const accordionHeaders = [...accordionHeadersNodeList];
  return accordionHeaders.map((accordionHeader) =>
    accordionHeader.textContent?.trim(),
  );
}

export function getCategoryOptions(
  featureCategory: string,
  filterBaryQuery = "#filter-bar",
  brandAccordionQuery = ".brandAccordion",
  filterModalULQuery = "#filter-modal-ul-container",
) {
  // Step 1: Find the Category Header
  const brandAccordion = [
    ...document.querySelectorAll(`${filterBaryQuery} ${brandAccordionQuery}`),
  ].find((element) => element.textContent?.includes(featureCategory));

  if (!brandAccordion) return [];

  // Step 2: Click the "Show More" button if available
  const showMoreDiv = [...brandAccordion.querySelectorAll(`div[onclick]`)].find(
    (span) => span.textContent?.includes("Show more"),
  );

  let options: string[] = [];
  let ul: HTMLUListElement;
  if (showMoreDiv instanceof HTMLElement) {
    // TODO: Add test for this
    showMoreDiv.click();
    ul = document.querySelector(filterModalULQuery) as HTMLUListElement;
  } else {
    ul = brandAccordion.querySelector(`ul`) as HTMLUListElement;
  }

  // Step 3: Extract the option values
  if (!ul) return ["ul not found"];
  options = getFilterCategoryOptions(ul);
  return options;

  //#region Helper Functions
  // Return the options for a given filter category
  // Extracts info from the modal UL
  function getFilterCategoryOptions(filterModalUlContainer: HTMLUListElement) {
    const ulHTMLCollection = filterModalUlContainer.children;
    const liElements = [...ulHTMLCollection] as HTMLLIElement[];
    return liElements.map((liElement) => {
      const checkboxInput = liElement.querySelector("label input");
      if (checkboxInput && checkboxInput.hasAttribute("data-refinement-value"))
        return checkboxInput.getAttribute("data-refinement-value") as string;

      // Plan B if the checkbox input data was not found
      const label = liElement.querySelector("label:not(.msc-checkbox)");
      return label instanceof HTMLLabelElement // Assert that the label was found
        ? extractTextExcludingSpan(label)
        : "";
    });
  }
}
// Function to remove the <span>(number)</span> from the label
function extractTextExcludingSpan(labelElement: HTMLLabelElement) {
  let result = "";
  labelElement.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent;
    }
  });
  return result.trim();
}
//#endregion

export function applyFilters(
  categoryName: string,
  optionsToSelect: string[],
  filterBaryQuery = "#filter-bar",
  brandAccordionQuery = ".brandAccordion",
  filterModalULQuery = "#filter-modal-ul-container",
) {
  const filterModalUl = document.querySelector(
    filterModalULQuery,
  ) as HTMLUListElement;
  const brandAccordion = [
    ...document.querySelectorAll(`${filterBaryQuery} ${brandAccordionQuery}`),
  ].find((element) => element.textContent?.includes(categoryName));
  const filterBarUl = brandAccordion?.querySelector(`ul`) as HTMLUListElement;
  // Choosing the correct <ul> based on which has more <li> elements
  let ul = filterBarUl;
  let shouldApplyFilter = false;
  if (
    filterModalUl.querySelectorAll("li").length >
    filterBarUl.querySelectorAll("li").length
  ) {
    ul = filterModalUl;
    shouldApplyFilter = true;
  }

  const succesfulClicks: string[] = [];
  // Step 1: Click relevant options
  // NOTE: Clicking the left bar checkbox immediately applies

  for (const optionToSelect of optionsToSelect) {
    // Look for the <li> that contains optionToSelect
    const li = [...ul.querySelectorAll(`li`)].find((element) => {
      console.log("li element: ", element);
      const dataRefinementValue = element
        .querySelector("a")
        ?.getAttribute("data-refinement-value");
      console.log("dataRefinementValue: ", dataRefinementValue);
      if (dataRefinementValue) return dataRefinementValue === optionToSelect;
      // Plan B
      // TODO: Verify this works correctly
      const label = extractTextExcludingSpan(
        element.querySelectorAll("label")[1],
      );
      console.log(
        "label: ",
        label,
        " should match optionToSelect: ",
        optionToSelect,
      );

      return label === optionToSelect;
    });
    const labelToClick = li?.querySelector("label");
    console.log(labelToClick?.getHTML());
    if (labelToClick instanceof HTMLElement) {
      labelToClick.click();
      // TODO: Verify it the label is checked
      succesfulClicks.push(labelToClick.getHTML());
    }
  }

  const applyFilterBtn = document.querySelector(
    `#filter-modal button[onclick]`,
  );
  if (
    shouldApplyFilter &&
    applyFilterBtn instanceof HTMLButtonElement &&
    applyFilterBtn.getAttribute("onclick") === "modalApplyFilterClickHandler()"
  )
    applyFilterBtn.click();
  return succesfulClicks;
}
