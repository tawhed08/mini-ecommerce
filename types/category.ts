export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type CategoryReference = Pick<Category, "_id" | "name"> | string | null;