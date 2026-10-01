import type { CategoryReference } from "./category";

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: CategoryReference;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

export type UpdateProductInput = Partial<CreateProductInput>;