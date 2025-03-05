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
  description: string = "";

  constructor(
    primaryName: string,
    price: Price,
    secondaryName?: string,
    description?: string,
  ) {
    this.primaryName = primaryName;
    this.price = price;
    if (secondaryName !== undefined) this.secondaryName = secondaryName;
    if (description !== undefined) this.description = description;
  }
}

export class McMasterItem extends Item {
  mcMasterId: string;
  itemFeatures: Record<string, string | Record<string, string>> = {};

  constructor(
    primaryName: string,
    price: Price,
    mcMasterId: string,
    itemFeatures: Record<string, string | Record<string, string>>,
    secondaryName?: string,
    description?: string,
  ) {
    super(primaryName, price, secondaryName, description);
    this.mcMasterId = mcMasterId;
    this.itemFeatures = itemFeatures;
  }
}
