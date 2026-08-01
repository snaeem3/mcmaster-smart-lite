import { expect, test } from "vitest";
import extractMscTable from "./extractMscTable";
import createTableFromHtml from "../utils/createTableFromHtml";

test("Reads MSC table successfully", () => {
  const table = createTableFromHtml(/*html*/ `
    <table class="w-full specs_table text-base">
        <tbody class="specs-tbody border">
          
          <tr class="specs-row desktop-row" data-index="0">
            
            <td id="Nut Type" data-value="Hex Nut" class="py-2 px-6 text-monochromes leading-4 text-sm md:text-base border-gray-200">
              <span class="font-medium text-gray-500">Nut Type:</span> Hex Nut
            </td>

            <td id="Material" data-value="Steel" class="py-2 px-6 text-monochromes leading-4 text-sm md:text-base border-gray-200">
              <span class="font-medium text-gray-500">Material:</span> Steel
            </td>
          
          </tr>
        
          <tr class="specs-row desktop-row" data-index="2">
            
            <td id="Thread Direction" data-value="Right Hand" class="py-2 px-6 text-monochromes leading-4 text-sm md:text-base border-gray-200">
              <span class="font-medium text-gray-500">Thread Direction:</span> Right Hand
            </td>
            <td id="Thread Size (Inch)" data-value="1/4-20" class="py-2 px-6 text-monochromes leading-4 text-sm md:text-base border-gray-200">
              <span class="font-medium text-gray-500">Thread Size (Inch):</span> 1/4-20
            </td>
          
          </tr>
        
          <tr class="specs-row desktop-row" data-index="4">
            
            <td id="Material Grade" data-value="5" class="py-2 px-6 text-monochromes leading-4 text-sm md:text-base border-gray-200">
              <span class="font-medium text-gray-500">Material Grade:</span> 5
            </td>
            <td id="Finish Coating" data-value="Zinc" class="py-2 px-6 text-monochromes leading-4 text-sm md:text-base border-gray-200">
              <span class="font-medium text-gray-500">Finish Coating:</span> Zinc
            </td>
          
          </tr>
        
          <tr class="specs-row desktop-row" data-index="6">
            
            <td id="Width Across Flats (Inch)" data-value="7/16" class="py-2 px-6 text-monochromes leading-4 text-sm md:text-base border-gray-200">
              <span class="font-medium text-gray-500">Width Across Flats (Inch):</span> 7/16
            </td>
            <td id="Thread Standard" data-value="UNC" class="py-2 px-6 text-monochromes leading-4 text-sm md:text-base border-gray-200">
              <span class="font-medium text-gray-500">Thread Standard:</span> UNC
            </td>
          
          </tr>
        
          <tr class="specs-row desktop-row" data-index="8">
            
            <td id="Military Specification" data-value="Does Not Meet Military Specifications" class="py-2 px-6 text-monochromes leading-4 text-sm md:text-base border-gray-200">
              <span class="font-medium text-gray-500">Military Specification:</span> Does Not Meet Military Specifications
            </td>
            <td id="Height (Inch)" data-value="7/32" class="py-2 px-6 text-monochromes leading-4 text-sm md:text-base border-gray-200">
              <span class="font-medium text-gray-500">Height (Inch):</span> 7/32
            </td>
          
          </tr>
        
          <tr class="specs-row desktop-row" data-index="10">
            
            <td id="UNSPSC Code" data-value="31161727" class="py-2 px-6 text-monochromes leading-4 text-sm md:text-base border-gray-200">
              <span class="font-medium text-gray-500">UNSPSC Code:</span> 31161727
            </td>
            <td class="py-2 px-6 text-monochromes leading-4 text-sm md:text-base border-gray-200"></td>
          
          </tr>
              <tr class="specs-row mobile-row " data-index="0">
                <td colspan="2" class="py-2 px-6 text-monochromes leading-4 text-sm border-b border-gray-200">
                  <span class="font-medium text-gray-500">Nut Type:</span> Hex Nut
                </td>
              </tr>
            
              <tr class="specs-row mobile-row " data-index="1">
                <td colspan="2" class="py-2 px-6 text-monochromes leading-4 text-sm border-b border-gray-200">
                  <span class="font-medium text-gray-500">Material:</span> Steel
                </td>
              </tr>
            
              <tr class="specs-row mobile-row " data-index="2">
                <td colspan="2" class="py-2 px-6 text-monochromes leading-4 text-sm border-b border-gray-200">
                  <span class="font-medium text-gray-500">Thread Direction:</span> Right Hand
                </td>
              </tr>
            
              <tr class="specs-row mobile-row " data-index="3">
                <td colspan="2" class="py-2 px-6 text-monochromes leading-4 text-sm border-b border-gray-200">
                  <span class="font-medium text-gray-500">Thread Size (Inch):</span> 1/4-20
                </td>
              </tr>
            
              <tr class="specs-row mobile-row " data-index="4">
                <td colspan="2" class="py-2 px-6 text-monochromes leading-4 text-sm border-b border-gray-200">
                  <span class="font-medium text-gray-500">Material Grade:</span> 5
                </td>
              </tr>
            
              <tr class="specs-row mobile-row hidden-mobile" data-index="5">
                <td colspan="2" class="py-2 px-6 text-monochromes leading-4 text-sm border-b border-gray-200">
                  <span class="font-medium text-gray-500">Finish Coating:</span> Zinc
                </td>
              </tr>
            
              <tr class="specs-row mobile-row hidden-mobile" data-index="6">
                <td colspan="2" class="py-2 px-6 text-monochromes leading-4 text-sm border-b border-gray-200">
                  <span class="font-medium text-gray-500">Width Across Flats (Inch):</span> 7/16
                </td>
              </tr>
            
              <tr class="specs-row mobile-row hidden-mobile" data-index="7">
                <td colspan="2" class="py-2 px-6 text-monochromes leading-4 text-sm border-b border-gray-200">
                  <span class="font-medium text-gray-500">Thread Standard:</span> UNC
                </td>
              </tr>
            
              <tr class="specs-row mobile-row hidden-mobile" data-index="8">
                <td colspan="2" class="py-2 px-6 text-monochromes leading-4 text-sm border-b border-gray-200">
                  <span class="font-medium text-gray-500">Military Specification:</span> Does Not Meet Military Specifications
                </td>
              </tr>
            
              <tr class="specs-row mobile-row hidden-mobile" data-index="9">
                <td colspan="2" class="py-2 px-6 text-monochromes leading-4 text-sm border-b border-gray-200">
                  <span class="font-medium text-gray-500">Height (Inch):</span> 7/32
                </td>
              </tr>
            
              <tr class="specs-row mobile-row hidden-mobile" data-index="10">
                <td colspan="2" class="py-2 px-6 text-monochromes leading-4 text-sm border-b border-gray-200">
                  <span class="font-medium text-gray-500">UNSPSC Code:</span> 31161727
                </td>
              </tr>
            
        </tbody>
      </table>
    `);

  expect(extractMscTable(table)).toEqual({
    "Finish Coating": "Zinc",
    "Height (Inch)": "7/32",
    Material: "Steel",
    "Material Grade": "5",
    "Military Specification": "Does Not Meet Military Specifications",
    "Nut Type": "Hex Nut",
    "Thread Direction": "Right Hand",
    "Thread Size (Inch)": "1/4-20",
    "Thread Standard": "UNC",
    "UNSPSC Code": "31161727",
    "Width Across Flats (Inch)": "7/16",
  });
});
