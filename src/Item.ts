export interface Item {
  primaryName: string;
  totalPrice: number;
  packageQuantity: number;
  secondaryName?: string;
  description?: string;
  url: string | URL;
  itemFeatures: Record<string, string | Record<string, string>>;
}

export interface McMasterItem extends Item {
  mcMasterId: string;
}
