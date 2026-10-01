import type { Product } from "./product";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  product: Product | string | null;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  customer: OrderCustomer;
  items: OrderItem[];
  totalItems: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  customer: OrderCustomer;
  items: Array<{
    product: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalItems: number;
  totalPrice: number;
}