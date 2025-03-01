export class Price {
  totalPrice: number;
  packageQuantity: number = 1;
  // TODO: handle currency types
  constructor(totalPrice: number, packageQuantity?: number) {
    this.totalPrice = totalPrice;
    if (packageQuantity && packageQuantity > 0)
      this.packageQuantity = packageQuantity;
  }

  public get unitPrice(): number {
    return this.totalPrice / this.packageQuantity;
  }
}

export default class Item {
  primaryName: string;
  price: Price;
  secondaryName?: string = "";
  mcMasterId: string;
  itemFeatures: Record<string, string | Record<string, string>> = {};
  description: string = "";

  constructor(
    primaryName: string,
    price: Price,
    otherMcMasterId: string,
    secondaryName?: string,
    itemFeatures?: Record<string, string | Record<string, string>>,
    description?: string,
  ) {
    this.primaryName = primaryName;
    this.price = price;
    this.mcMasterId = otherMcMasterId;
    if (secondaryName !== undefined) this.secondaryName = secondaryName;
    if (itemFeatures !== undefined) this.itemFeatures = itemFeatures;
    if (description !== undefined) this.description = description;
  }
}
