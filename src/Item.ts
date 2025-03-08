export interface Item {
  primaryName: string;
  totalPrice: number;
  packageQuantity: number;
  secondaryName?: string;
  description?: string;
  url: string | URL;
}

export interface McMasterItem extends Item {
  mcMasterId: string;
  itemFeatures: Record<string, string | Record<string, string>>;
}
