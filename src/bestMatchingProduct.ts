import { stringSimilarity } from "string-similarity-js";
import { McMasterItem } from "./Item";
import { MSCItem } from "./msc/MSCItem";

export default function getBestMatchingProduct(
  mcmasterProd: Partial<McMasterItem>,
  mscProds: Partial<MSCItem>[],
  minScore = 0.5,
) {
  const scores = mscProds.map((mscProd) => ({
    product: mscProd,
    score: calculateSimilarityScore(mcmasterProd, mscProd),
  }));
  console.log("scores: ", scores);

  const bestMatch = scores.reduce((best, current) =>
    current.score > best.score ? current : best,
  );

  return bestMatch.score < minScore
    ? {
        error: `No matching product found with a score above the minimum threshold (${minScore}). Highest Score: ${bestMatch.score}`,
        score: bestMatch.score,
      }
    : { bestProduct: bestMatch.product, score: bestMatch.score };
}

function calculateSimilarityScore(
  mcmasterProd: Partial<McMasterItem>,
  mscProd: Partial<MSCItem>,
): number {
  if (
    !mcmasterProd.itemFeatures ||
    Object.keys(mcmasterProd.itemFeatures).length === 0
  ) {
    throw new Error(
      "McMasterItem must have itemFeatures to calculate similarity.",
    );
  }

  const mcmasterText = extractFeaturesText(mcmasterProd.itemFeatures);
  const mscText = mscProd.description || "";

  return stringSimilarity(mcmasterText, mscText);
  //   return calculateTextSimilarity(mcmasterText, mscText);
}

function extractFeaturesText(
  itemFeatures: Record<string, string | Record<string, string>>,
): string {
  return Object.values(itemFeatures)
    .map((value) =>
      typeof value === "string" ? value : Object.values(value).join(" "),
    )
    .join(" ");
}

function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter((word) => words2.has(word)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}
