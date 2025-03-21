import { ProductImage } from './productImage';

export interface DetailsProductResponse {
  message: string;
  product: ProductResponse;
}

export interface ProductResponse {
  product_id: number;
  title: string;
  description: string;
  price: string;
  stock: number;
  category_id: number;
  created_by_user_id: number;
  status_id: number;
  created_at: string;
  updated_at: string;
  status_name: string;
  category_title: string;
  attributes?: ProductAttribute[];
  images: ProductImage[];
}

export interface ProductAttribute {
  key: string;
  attribute_id: number;
  values: AttributeValue[];
}

interface AttributeValue {
  value: string;
  value_id: number;
}

// // Інтерфейс відповіді
// interface ProductResponse {
//   message: string;
//   product: Product;
// }

// // Інтерфейс продукту
// interface Product {
//   product_id: number;
//   title: string;
//   description: string;
//   price: string;
//   stock: number;
//   category_id: number;
//   status_id: number;
//   created_at: string;
//   updated_at: string;
//   status_name: string;
//   category_title: string;
//   attributes: ProductAttribute[];
//   images: ProductImage[];
// }

// // Інтерфейс для атрибутів продукту
// interface ProductAttribute {
//   key: string;
//   attribute_id: number;
//   values: AttributeValue[];
// }

// // Інтерфейс для значень атрибутів
// interface AttributeValue {
//   value: string;
//   value_id: number;
// }
