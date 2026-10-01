"use client";

import type { Category } from "@/types/category";

interface CategoryFilterProps {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
}

export default function CategoryFilter({
  categories,
  value,
  onChange,
}: CategoryFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-gray-300 bg-white px-5 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
      <option value="">All Categories</option>

      {categories.map((category) => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}