export interface Order {
  order_id: number;
  status_id: number;
  status_name: string;
  email: string;
  phone: string;
  customer_name: string;
  items: OrderItem[];
  total_cost: string;
}

export interface OrderItem {
  productId: number;
  title: string;
  quantity: number;
  price: number;
  image_path?: string;
}

export interface TableOrder {
  title: string;
  total_cost: number;
  image_path?: string;
}
