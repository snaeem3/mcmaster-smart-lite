# McMaster-Smart

> Browser extension to find cheaper hardware alternatives

I use [McMaster-Carr](mcmaster.com) a lot, but have frequently found their prices to be higher than their competitors ([MSC](mscdirect.com), [Grainger](grainger.com), etc.). However, the UI on competitor websites makes searching for alternatives frustrating.

This extension aims to solve this problem by quickly searching for your McMaster product elsewhere.

## Install
1. Fork this repository and use the `git clone` command in your terminal to clone it to your machine
2. `cd` into the cloned repository and run `npm install` to install the dependencies
3. Run `npm build:bundle` to create the extension bundle
4. Navigate to [chrome://extensions/](chrome://extensions/) and turn on _Developer Mode_ in the top right corner
5. Click the _Load unpacked_ button and navigate to the `/distribution` folder
6. Click _Select Folder_
7. Ensure that the extension is enabled in [chrome://extensions/](chrome://extensions/)

The extension should now be running when you visit a [McMaster-Carr](mcmaster.com) product page.

## Roadmap
This roadmap describes my current, future, and past goals for this project. 

### Current
* Improve search queries created by `createSearchQueries.ts` to yield better search results
* Improve selection/ranking of found alternatives in `bestMatchingProducts.ts`
* Automate extension testing
* Switch from vanilla JS to a front-end framework
* Make features editable/selectable before searching
* Investigate applying the left-hand side MSC filters to narrow search results

### Future
* Search other sites besides MSC
* Investigate using an LLM or Machine Learning to better select the best matching product
* Move MSC/competitor querying to a backend service

### Past
- [x] Successfully extract data from a McMaster product page
- [x] Create a basic search query from the McMaster product
- [x] Develop the initial algorithm to select/rank the best matching product(s)
- [x] Successfully query MSC results and return the search results back to the extension