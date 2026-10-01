"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProductById } from "@/lib/api";
import { getProductCategoryName } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { cart, hydrated, addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-6xl py-20 text-center">
          <p className="text-gray-500">Loading product...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-6xl py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {error ? "Unable to Load Product" : "Product Not Found"}
          </h1>

          <p className="mt-3 text-gray-500">
            {error || "This product could not be found."}
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const categoryName = getProductCategoryName(product);
  const cartQuantity =
    cart.find((item) => item.product._id === product._id)?.quantity ?? 0;
  const canAddToCart = hydrated && cartQuantity < product.stock;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Products
        </Link>

        {/* Product Details */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 md:grid-cols-2">

            {/* Image */}
            <div className="relative min-h-100 bg-slate-100">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex min-h-100 items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl">🛍️</div>
                    <p className="mt-3 text-sm font-medium text-slate-400">
                      No Image Available
                    </p>
                  </div>
                </div>
              )}

              {/* Stock Badge */}
              <div className="absolute right-5 top-5">
                {isOutOfStock ? (
                  <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="rounded-full bg-amber-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                    Only {product.stock} left
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                    In Stock
                  </span>
                )}
              </div>
            </div>

            {/* Information */}
            <div className="flex flex-col justify-center p-8 md:p-12">

              {/* Category */}
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                {categoryName}
              </p>

              {/* Name */}
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
                {product.name}
              </h1>

              {/* Description */}
              <p className="mt-6 text-base leading-7 text-slate-600">
                {product.description || "No description available."}
              </p>

              {/* Price */}
              <div className="mt-8">
                <p className="text-sm font-medium text-slate-400">
                  Price
                </p>

                <p className="mt-1 text-4xl font-black text-slate-900">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              {/* Stock */}
              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">
                    Available Stock
                  </span>

                  <span
                    className={`font-bold ${
                      isOutOfStock
                        ? "text-red-500"
                        : isLowStock
                          ? "text-amber-500"
                          : "text-emerald-600"
                    }`}
                  >
                    {product.stock} units
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2">

                <Link
                  href="/products"
                  className="flex items-center justify-center rounded-xl border border-slate-300 px-4 py-3.5 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Continue Shopping
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(product);
                    setAddedToCart(true);
                  }}
                  disabled={!canAddToCart}
                  className="rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isOutOfStock
                    ? "Out of Stock"
                    : !canAddToCart
                      ? "Stock Limit in Cart"
                    : addedToCart
                      ? "Added to Cart"
                      : "Add to Cart"}
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}