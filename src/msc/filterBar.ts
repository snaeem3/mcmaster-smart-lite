export function filterBar(filterBaryQuery = "#filter-bar") {
  const filterBar = document.querySelector(filterBaryQuery) as HTMLDivElement;
  return getAccordionHeaders(filterBar);

  function getAccordionHeaders(
    filterBar: HTMLDivElement | HTMLUListElement,
    headerQuery = ".accordionHeader",
  ) {
    const accordionHeadersNodeList = filterBar.querySelectorAll(headerQuery);
    const accordionHeaders = [...accordionHeadersNodeList];
    return accordionHeaders.map((accordionHeader) =>
      accordionHeader.textContent?.trim(),
    );
  }
}

export function applyCategoryFilter(
  categoryName: string,
  mcmasterFeatures: Record<string, string | Record<string, string>>,
  filterBaryQuery = "#filter-bar",
  brandAccordionQuery = ".brandAccordion",
) {
  // Step 1: Find the Category Header
  const brandAccordion = [
    ...document.querySelectorAll(`${filterBaryQuery} ${brandAccordionQuery}`),
  ].find((element) => element.textContent?.includes(categoryName));

  if (!brandAccordion) return [];

  // Step 2: Click the "Show More" button if available
  const showMoreDiv = [...brandAccordion.querySelectorAll(`div[onclick]`)].find(
    (span) => span.textContent?.includes("Show more"),
  );
  // TODO: Handle situations when "Show More" button is and isn't there
  // if (showMoreDiv) return [`${categoryName} has a Show more button`];
  // return [`${categoryName} does NOT have a Show more button`];

  // Step 3: Extract the option values
  const ul = brandAccordion.querySelector(`ul`);
  if (!ul) return ["ul not found"];
  const options = getFilterCategoryOptions(ul);
  return options;
  // Step 4: Check if any option values match the the mcmasterItem.itemFatures[categoryName]
  // Step 5: Click relevant options
  // Step 6: Return the names of the options found and clicked

  //#region Helper Functions
  // Return the options for a given filter category
  // Extracts info from the modal UL
  function getFilterCategoryOptions(filterModalUlContainer: HTMLUListElement) {
    const ulHTMLCollection = filterModalUlContainer.children;
    const liElements = [...ulHTMLCollection] as HTMLLIElement[];
    return liElements.map((liElement) => {
      const checkboxInput = liElement.querySelector("label input");
      if (checkboxInput && checkboxInput.hasAttribute("data-refinement-value"))
        return checkboxInput.getAttribute("data-refinement-value");

      // Plan B if the checkbox input data was not found
      const label = liElement.querySelector("label:not(.msc-checkbox)");
      return label instanceof HTMLLabelElement // Assert that the label was found
        ? extractTextExcludingSpan(label)
        : null;
    });
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
}
