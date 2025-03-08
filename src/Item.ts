export interface Item {
  primaryName: string;
  totalPrice: number;
  packageQuantity: number;
  secondaryName?: string;
  description?: string;
}

export interface McMasterItem extends Item {
  mcMasterId: string;
  itemFeatures: Record<string, string | Record<string, string>>;
}
