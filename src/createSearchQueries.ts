import { McMasterItem } from "./Item";

export default function createSearchQueries(McMasterItem: McMasterItem) {
  const results: URLSearchParams[] = [];
  /*
   *    Idea 1: use the first n features, they are probably the most important
   *    Idea 2: determine the simplest possible query and apply filters during the actual search
   *        2a: rank the queries from simplest -> most complex
   *    Idea 3: use another search engine
   *    Idea 4: Count the number of actual features from the title that are in the feature list (these are presumable the most important) then shuffle the order of the features
   *
   **/

  let searchParams: URLSearchParams;
  // Method 1- primary name only
  searchParams = new URLSearchParams({ searchterm: McMasterItem.primaryName });
  results.push(searchParams);

  // Method 2- combine primary name and secondary name
  searchParams = new URLSearchParams({
    searchterm: `${McMasterItem.primaryName} ${McMasterItem.secondaryName}`,
  });
  results.push(searchParams);
  return results;
}
