# McMaster-Smart-Lite

> Browser extension to find cheaper hardware alternatives

I use [McMaster-Carr](https://mcmaster.com) a lot, but have frequently found their prices to be higher than their competitors ([MSC](https://mscdirect.com), [Grainger](https://grainger.com), etc.). However, the UI on competitor websites makes searching for alternatives frustrating.

This extension aims to solve this problem by quickly searching for your McMaster product elsewhere. The McMaster Smart Lite extension is designed to be a simple 1-click interface. For more advanced search options and additional features, please check out the [McMaster Smart](https://github.com/snaeem3/mcmaster-smart) chrome extension.

<p align="center">
<sub>Popup</sub>
<br/>
  <img width="282" height="220" alt="Lite popup" src="https://github.com/user-attachments/assets/b61c1af5-8a75-486b-a15e-4222f1424436" valign="middle"/>
  <img width="266" height="350" alt="Lite results" src="https://github.com/user-attachments/assets/7dc880db-eaae-462c-885d-65a1a5e6c892" valign="middle"/>
<br/>
</p>

## Install
[link-chrome]: https://chromewebstore.google.com/detail/mcmaster-smart-lite/nmlkcbnplhaffhooaioodjlghepdlopk 'Version published on Chrome Web Store'
[link-edge]: https://microsoftedge.microsoft.com/addons/detail/mcmaster-smart-lite/elneomkapagamimnpageolddlpcaemdc 'Version published on Edge Add-ons'

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/chrome/chrome.svg" width="48" alt="Chrome" valign="middle">][link-chrome] Chrome download

[<img width="48" alt="Edge" src="https://github.com/user-attachments/assets/5d735aaa-d9cb-46df-8348-5fa2644401e0" valign="middle">][link-edge] Edge download


## Developer Install
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
* Create a CI/CD pipeline to automatically update the extension in the chrome/edge web stores


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
