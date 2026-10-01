import type { Product } from "@/types/product";

export function getProductCategoryName(product: Product): string {
  const category = product.category;
  if (typeof category === "object" && category !== null) {
    return category.name;
  }
  return typeof category === "string" ? category : "Uncategorized";
}