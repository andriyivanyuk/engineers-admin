// import { ProductImage } from './productImage';

import { ProductImage } from './productImage';

export interface CreateProductResponse {
  message: string;
  productId: number;
  images: ProductImage[];
}
