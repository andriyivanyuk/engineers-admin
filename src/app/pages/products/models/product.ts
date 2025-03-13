import { ProductAttribute } from './productAttribute';
import { ProductImage } from './productImage';

export interface Product {
  product_id: number;
  title: string;
  description: string;
  price: string;
  stock: number;
  status_name: string;
  category_title: string;
  attributes: ProductAttribute[];
  images: ProductImage[];
}
