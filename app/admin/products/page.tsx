"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { deleteProduct, getProducts } from "@/lib/api";
import { Product } from "@/types/product";
import AdminGuard from "@/components/AdminGuard";

function AdminProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        if (!cancelled) {
          setProducts(data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load products:", error);

          setError(
            error instanceof Error
              ? error.message
              : "Failed to load products."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await deleteProduct(id);

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete product:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-7xl py-20 text-center">
          <p className="text-gray-500">Loading products...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Admin Panel
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Product Management
            </h1>

            <p className="mt-2 text-gray-500">
              Add, edit, and delete products.
            </p>
          </div>

          <Link
            href="/products/add"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            + Add Product
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Product Count */}
        <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Products
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-900">
            {products.length}
          </p>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No products found
            </h2>

            <p className="mt-2 text-gray-500">
              Add your first product to get started.
            </p>

            <Link
              href="/products/add"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Add Product
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-gray-100">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="56px"
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {product.name}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              ID: {product._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                          {typeof product.category === "string"
                            ? product.category
                            : product.category?.name || "No Category"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ${product.price}
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <span
                          className={
                            product.stock > 0
                              ? "font-medium text-green-600"
                              : "font-medium text-red-600"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/products/${product._id}`}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                          >
                            View
                          </Link>

                          <Link
                            href={`/products/${product._id}/edit`}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                product._id,
                                product.name
                              )
                            }
                            disabled={deletingId === product._id}
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === product._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AdminProductsPage() {
  return (
    <AdminGuard>
      <AdminProductsContent />
    </AdminGuard>
  );
}