import { Product } from "./product";

export interface Category {
  id: string;
  name: string;
  fileName: string;
  fileURL: string;
  fileName_low: string;
  fileURL_low: string;
  products: Product[];
  created: Date;
}
