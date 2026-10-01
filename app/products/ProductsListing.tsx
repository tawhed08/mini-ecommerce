"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import { getCategories, getProducts } from "@/lib/api";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export default function ProductsListing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [productData, categoryData] = await Promise.all([
          getProducts(search, selectedCategory),
          getCategories(),
        ]);

        if (active) {
          setProducts(productData);
          setCategories(categoryData);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load products."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [search, selectedCategory, reloadKey]);

  const updateCategory = (categoryId: string) => {
    router.replace(
      categoryId
        ? `/products?category=${encodeURIComponent(categoryId)}`
        : "/products"
    );
  };

  const clearFilters = () => {
    setSearch("");
    updateCategory("");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Shop Now
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Explore Our Products
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
                Discover quality essentials, everyday favorites, and products
                designed for modern living.
              </p>
            </div>
            {!loading && !error && (
              <div className="inline-flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-lg shadow-blue-600/20">
                  🛍️
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">
                    {products.length}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Products available
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <SearchBar
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
            />
            <CategoryFilter
              categories={categories}
              value={selectedCategory}
              onChange={updateCategory}
            />
          </div>
          {(search || selectedCategory) && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 rounded-lg px-2 py-1 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading products">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="h-105 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm" role="alert">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl">
              ⚠️
            </div>
            <h2 className="mt-5 text-2xl font-black text-slate-900">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((current) => current + 1)}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-4xl">
              🔎
            </div>
            <h2 className="mt-6 text-2xl font-black text-slate-900">
              No Products Found
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Try adjusting your search or choosing a different category.
            </p>
            {(search || selectedCategory) && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
