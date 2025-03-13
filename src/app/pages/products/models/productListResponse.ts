import { ViewProduct } from './viewProduct';

export interface ProductListResponse {
  products: ViewProduct[];
  total: number;
  page: number;
  limit: number;
}
