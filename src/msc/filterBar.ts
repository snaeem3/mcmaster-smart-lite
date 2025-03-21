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

// Return the options for a given filter category
// Extracts info from the modal UL
export function getFilterCategoryOptions(
  filterModalUlContainer: HTMLUListElement,
) {
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
