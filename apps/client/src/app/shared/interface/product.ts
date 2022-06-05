import { Category } from "./category";

export interface Product {
  id: string;
  productCode: string;
  name: string;
  price: string;
  isFavorite: boolean;
  isAvailable: boolean;
  fileName: string;
  fileURL: string;
  fileName_low: string;
  fileURL_low: string;
  category: Category;
  created: Date;
}
