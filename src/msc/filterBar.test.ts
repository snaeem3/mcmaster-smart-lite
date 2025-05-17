import { beforeEach, expect, test } from "vitest";
import { getAccordionHeaders, getCategoryOptions } from "./filterBar";

let filterModalUlContainer: HTMLUListElement;
const featureCategory = "Head Type";
const filterOptions = [
  "82 degree Flat",
  "Flat",
  "Flat Undercut",
  "Hex",
  "Hex Washer",
  "Oval",
  "Pan",
  "Round",
  "Truss",
];

beforeEach(() => {
  // Filter Bar
  const filterBarDiv = document.createElement("div");
  filterBarDiv.id = "filter-bar";
  const filterBarUl = document.createElement("ul");
  const brandAccordion = document.createElement("div");
  brandAccordion.className = "brandAccordion";
  const accordionHeader = document.createElement("div");
  accordionHeader.className = "accordionHeader cursor-pointer";
  const accordionHeaderDiv = document.createElement("div");
  const accordionHeaderP = document.createElement("p");
  accordionHeaderP.textContent = featureCategory;
  const accordionArrowButton = document.createElement("button");
  accordionArrowButton.className = "accordionArrow";
  accordionHeaderDiv.append(accordionHeaderP, accordionArrowButton);
  accordionHeader.appendChild(accordionHeaderDiv);
  brandAccordion.appendChild(accordionHeader);
  const accordionContent = document.createElement("div");
  accordionContent.id = "Head-Type-content";
  accordionContent.className =
    "accordionContent transition delay-300 duration-300 ease-in-out mt-6 block";
  const searchProductDiv = document.createElement("div");
  searchProductDiv.className =
    "searchProduct relative w-full md:w-312 ipadmini:w-272 xl:w-297 2xl:w-304 3xl:w-312";
  const accordionContentUl = document.createElement("ul");
  accordionContentUl.id = "Head-Type-list-container";
  filterOptions.forEach((filterOption) => {
    const liElement = document.createElement("li");
    liElement.className = "flex py-3";
    const liDiv = document.createElement("div");
    const mscCheckbox = document.createElement("label");
    mscCheckbox.className = "checkbox";
    const checkbox = document.createElement("input");
    checkbox.setAttribute("data-refinement-name", featureCategory);
    checkbox.setAttribute("data-refinement-value", filterOption);
    const optionTextLabel = document.createElement("label");
    optionTextLabel.className =
      "text-sm xl:text-base leading-17 xl:leading-5 text-monochromes cursor-pointer flex-grow";
    const a = document.createElement("a");
    a.setAttribute("data-refinement-value", filterOption);
    a.textContent = `${filterOption} `; // intentional space
    const span = document.createElement("span");
    span.textContent = `(${Math.floor(Math.random() * (100 - 1 + 1) + 1)})`; // random number between 0 and 100

    mscCheckbox.appendChild(checkbox);
    a.appendChild(span);
    optionTextLabel.appendChild(a);
    liDiv.append(mscCheckbox, optionTextLabel);
    liElement.appendChild(liDiv);
    accordionContentUl.appendChild(liElement);
  });
  accordionContent.appendChild(accordionContentUl);
  brandAccordion.append(accordionHeader, accordionContent);
  filterBarUl.append(brandAccordion);
  filterBarDiv.appendChild(filterBarUl);
  document.body.appendChild(filterBarDiv);

  // Modal
  filterModalUlContainer = document.createElement("ul");
  filterModalUlContainer.id = "filter-modal-ul-container";
  filterOptions.forEach((filterOption) => {
    const liElement = document.createElement("li");
    liElement.classList.add(..."w-full md:w-1/3 xl:w-1/4 p-3 pl-0".split(" "));
    const div = document.createElement("div");
    div.classList.add(..."flex flex-grow group".split(" "));

    const checkBoxLabel = document.createElement("label");
    checkBoxLabel.classList.add("msc-checkbox");
    const input = document.createElement("input");
    input.setAttribute("data-refinement-value", filterOption);
    const checkMarkBox = document.createElement("span");
    checkMarkBox.classList.add(
      ..."msc-checkmark group-hover:border-monochromes".split(" "),
    );
    checkBoxLabel.append(input, checkMarkBox);

    const label = document.createElement("label");
    label.classList.add(
      ..."text-sm xl:text-base leading-17 xl:leading-5 text-monochromes cursor-pointer flex-grow break-all".split(
        " ",
      ),
    );
    const textNode = document.createTextNode(filterOption);
    const span = document.createElement("span");
    span.textContent = `(${Math.floor(Math.random() * (100 - 1 + 1) + 1)})`; // random number between 0 and 100
    label.append(textNode, span);

    div.append(checkBoxLabel, label);
    liElement.appendChild(div);
    filterModalUlContainer.appendChild(liElement);
  });
  document.body.appendChild(filterModalUlContainer);
});

test("Returns accordion headers", () => {
  expect(getAccordionHeaders()).toEqual(["Head Type"]);
});

test("Returns the filter category options", () => {
  expect(getCategoryOptions(featureCategory)).toEqual(
    expect.arrayContaining(filterOptions),
  );
  expect(getCategoryOptions(featureCategory)).toEqual(
    expect.arrayContaining(filterOptions.reverse()),
  );
});

// TODO
// test("Returns the filter category options if 'Show More' button is available", () => {

// });
