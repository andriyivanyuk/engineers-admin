export interface DetailsProductResponse {
  message: string;
  product: ProductResponse;
}

export interface ProductImage {
  image_path: string;
  is_primary: boolean;
  image_id: number;
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
  attributes?: ProductResponseAttribute[];
  images: ProductImage[];
}

export interface ProductResponseAttribute {
  attribute_id: number;
  attribute_name: string;
  attribute_value: string;
}
