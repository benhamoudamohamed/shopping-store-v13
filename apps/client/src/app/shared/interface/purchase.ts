import { ProductModel } from "@shoppingstore/api-interfaces";

export interface Purchase {
  id: string;
  items: ProductModel[];
  subtotal: number;
  coupon: string;
  discount: number;
  grandTotal: number;
  clientName: string;
  email: string;
  phone: string;
  address: string;
  created: Date;
}
