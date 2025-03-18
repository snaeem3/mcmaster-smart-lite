function getAccordianHeaders(
  filterBar: HTMLDivElement | HTMLUListElement,
  query = ".accordionHeader",
) {
  const accordionHeadersNodeList = filterBar.querySelectorAll(query);
  const accordionHeaders = [...accordionHeadersNodeList];
  return accordionHeaders.map((accordionHeader) =>
    accordionHeader.textContent?.trim(),
  );
}

// Return the options for a given filter category
// Extracts info from the modal UL
function getFilterCategoryOptions(filterModalUlContainer: HTMLUListElement) {
  const ulHTMLCollection = filterModalUlContainer.children;
  const liElements = [...ulHTMLCollection] as HTMLLIElement[];
  return liElements.map((liElement) => {
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
