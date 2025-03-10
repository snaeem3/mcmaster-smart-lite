import { beforeEach, expect, test } from "vitest";
import createSearchQueries from "./createSearchQueries";
import { McMasterItem } from "./Item";

let item: McMasterItem;
beforeEach(() => {
  // TODO: Add remaining itemFeatures
  item = {
    primaryName: "Black-Oxide Alloy Steel Hex Drive Flat Head Screw",
    secondaryName: '6-32 Thread Size, 1-1/2" Long',
    mcMasterId: "91253A157",
    packageQuantity: 25,
    totalPrice: 12.26,
    url: "https://www.mcmaster.com/91253A157/",
    itemFeatures: {
      "Thread Size": "6-32",
      Length: '1 1/2"',
      Threading: "Partially Threaded",
      "Countersink Angle": "82°",
      Material: "Black-Oxide Alloy Steel",
      "Thread Type": "UNC",
      "Thread Direction": "Right Hand",
      "Head Type": "Flat",
      "System of Measurement": "Inch",
    },
  };
});

test("Creates a URL search param from just the primaryName", () => {
  const urlResults = createSearchQueries(item);
  const urlResultsStrings = urlResults.map((urlResult) => urlResult.toString());

  expect(urlResultsStrings).toContain(
    "searchterm=Black-Oxide+Alloy+Steel+Hex+Drive+Flat+Head+Screw",
  );
});

test("Creates a URL search param from the primaryName and secondaryName", () => {
  const urlResults = createSearchQueries(item);
  const urlResultsStrings = urlResults.map((urlResult) => urlResult.toString());

  // URL Search Params encodes " but chrome browser does not
  const targetSearchterms = [
    'searchterm=Black-Oxide+Alloy+Steel+Hex+Drive+Flat+Head+Screw+6-32+Thread+Size%2C+1-1%2F2"+Long',
    "searchterm=Black-Oxide+Alloy+Steel+Hex+Drive+Flat+Head+Screw+6-32+Thread+Size%2C+1-1%2F2%22+Long",
  ];
  // Check if either searchterm is a query
  const hasValidURL = urlResultsStrings.some((urlResultsString) =>
    targetSearchterms.includes(urlResultsString),
  );
  expect(hasValidURL).toBe(true);
});
