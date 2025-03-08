import { Item } from "../Item";

enum StockStatus {
  inStock = "IN STOCK",
  outOfStock = "OUT OF STOCK",
  shipsFromSupplier = "SHIPS FROM SUPPLIER",
}

export interface MSCItem extends Item {
  mscId: string;
  // mfrId: string;
  manufacturer: string;
  inStock: StockStatus;
  // TODO: product image
}
