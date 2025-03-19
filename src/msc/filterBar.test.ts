import { beforeEach, expect, test } from "vitest";
import { getFilterCategoryOptions } from "./filterBar";

let filterModalUlContainer: HTMLUListElement;
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
});

test("Returns the filter category options", () => {
  expect(getFilterCategoryOptions(filterModalUlContainer)).toEqual(
    expect.arrayContaining(filterOptions),
  );
  expect(getFilterCategoryOptions(filterModalUlContainer)).toEqual(
    expect.arrayContaining(filterOptions.reverse()),
  );
});
