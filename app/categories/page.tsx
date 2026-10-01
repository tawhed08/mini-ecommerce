
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api";
import { Category } from "@/types/category";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load categories."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Shop by Category
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Explore Our
              <span className="block text-blue-600">
                Categories
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              Browse our collection by category and quickly discover
              products that match what you are looking for.
            </p>
          </div>

          {!loading && !error && (
            <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-lg shadow-blue-600/20">
                🗂️
              </div>

              <div>
                <p className="text-2xl font-black text-slate-900">
                  {categories.length}
                </p>

                <p className="text-xs font-medium text-slate-500">
                  Categories available
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <CategorySkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl">
              ⚠️
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-900">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-4xl">
              🗂️
            </div>

            <h2 className="mt-6 text-2xl font-black text-slate-900">
              No Categories Found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              There are currently no categories available. Add categories
              from your backend to display them here.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Browse Products
              <span>→</span>
            </Link>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <>
            <div className="mb-7 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  All Categories
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                  Find Your Category
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Choose a category to explore related products.
                </p>
              </div>

              <Link
                href="/products"
                className="hidden text-sm font-bold text-blue-600 transition hover:text-blue-700 sm:block"
              >
                View All Products →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category, index) => (
                <Link
                  key={category._id}
                  href={`/products?category=${category._id}`}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/70"
                >
                  {/* Decorative Background */}
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-50 transition duration-500 group-hover:scale-150" />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl transition duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                        {getCategoryIcon(index)}
                      </div>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition duration-300 group-hover:bg-blue-50 group-hover:text-blue-600">
                        →
                      </span>
                    </div>

                    <h3 className="mt-7 text-xl font-black text-slate-900 transition duration-300 group-hover:text-blue-600">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Explore products in this category.
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                      Explore Category
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>

                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Bottom CTA */}
        {!loading && !error && categories.length > 0 && (
          <div className="mt-12 overflow-hidden rounded-3xl bg-slate-900 px-6 py-10 shadow-xl sm:px-10 lg:mt-16 lg:py-12">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                  Looking for something specific?
                </p>

                <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                  Explore the complete collection.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                  Browse every available product and find exactly what you
                  need.
                </p>
              </div>

              <Link
                href="/products"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
              >
                View All Products
                <span>→</span>
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function CategorySkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-14 w-14 animate-pulse rounded-2xl bg-slate-200" />

      <div className="mt-7 h-6 w-3/4 animate-pulse rounded bg-slate-200" />

      <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-200" />

      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-200" />

      <div className="mt-6 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
    </div>
  );
}

function getCategoryIcon(index: number) {
  const icons = ["💻", "🎧", "📱", "⌚", "🖥️", "🎮", "📷", "🛍️"];

  return icons[index % icons.length];
}
