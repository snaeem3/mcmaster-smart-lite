import Item, { Price } from "../Item";

enum StockStatus {
  inStock = "IN STOCK",
  outOfStock = "OUT OF STOCK",
  shipsFromSupplier = "SHIPS FROM SUPPLIER",
}

export default class MSCItem extends Item {
  mscId: string;
  // mfrId: string;
  manufacturer: string;
  inStock: StockStatus;
  // TODO: product image
  constructor(
    primaryName: string,
    price: Price,
    mscId: string,
    manufacturer: string,
    inStock: StockStatus,
    secondaryName?: string,
    itemFeatures?: Record<string, string | Record<string, string>>,
    description?: string,
  ) {
    super(primaryName, price, secondaryName, description);
    this.mscId = mscId;
    this.manufacturer = manufacturer;
    this.inStock = inStock;
  }
}
