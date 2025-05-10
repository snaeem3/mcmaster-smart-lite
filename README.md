# McMaster-Smart-Lite

> Browser extension to find cheaper hardware alternatives

I use [McMaster-Carr](https://mcmaster.com) a lot, but have frequently found their prices to be higher than their competitors ([MSC](https://mscdirect.com), [Grainger](https://grainger.com), etc.). However, the UI on competitor websites makes searching for alternatives frustrating.

This extension aims to solve this problem by quickly searching for your McMaster product elsewhere. The McMaster Smart Lite extension is designed to be a simple 1-click interface. For more advanced search options and additional features, please check out the [McMaster Smart](https://github.com/snaeem3/mcmaster-smart) chrome extension.

<p align="center">
<sub>Popup</sub><br/>
<img src="https://github-production-user-asset-6210df.s3.amazonaws.com/11710951/449775728-e8157419-6690-4dc0-8a69-e789f0a93750.PNG?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250601%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250601T140412Z&X-Amz-Expires=300&X-Amz-Signature=6bd1884225e44d2a524952f347c66b7b75b0d74827b5edf89cd676c8c0a927c9&X-Amz-SignedHeaders=host"><br/>
</p>

## Install
1. Fork this repository and use the `git clone` command in your terminal to clone it to your machine
2. `cd` into the cloned repository and run `npm install` to install the dependencies
3. Run `npm build:bundle` to create the extension bundle
4. Navigate to [chrome://extensions/](chrome://extensions/) and turn on _Developer Mode_ in the top right corner
5. Click the _Load unpacked_ button and navigate to the `/distribution` folder
6. Click _Select Folder_
7. Ensure that the extension is enabled in [chrome://extensions/](chrome://extensions/)

The extension should now be running when you visit a [McMaster-Carr](https://mcmaster.com) product page.

## Roadmap
This roadmap describes my current, future, and past goals for this project. 

### Current
* Improve search queries created by `createSearchQueries.ts` to yield better search results
* Improve selection/ranking of found alternatives in `bestMatchingProducts.ts`
* Automate extension testing


### Future
* Search other sites besides MSC
* Investigate using an LLM or Machine Learning to better select the best matching product
* Move MSC/competitor querying to a backend service

### Past
- [x] Successfully extract data from a McMaster product page
- [x] Create a basic search query from the McMaster product
- [x] Develop the initial algorithm to select/rank the best matching product(s)
- [x] Successfully query MSC results and return the search results back to the extension
- [x] Successfully apply left-hand side MSC filters to narrow search results
- [x] Create preprocessing steps for converting MSC string data to match McMaster's format
- [x] Improve MSC side bar filtering to better recognize equivalent terms such as "Length" "Length (Inch)" and "Length (Decimal Inch)"