import { Product } from './product';

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}
