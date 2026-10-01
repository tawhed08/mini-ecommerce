
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { getProductCategoryName } from "@/lib/products";

export default function CartPage() {
  const {
    cart,
    hydrated,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  // Loading state
  if (!hydrated) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex min-h-72 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  🛒
                </div>

                <p className="mt-4 text-sm font-medium text-slate-500">
                  Loading your cart...
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Empty cart
  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="relative px-6 py-16 text-center sm:px-10 sm:py-20">
              <div className="absolute left-0 right-0 top-0 h-1 bg-linear-to-r from-blue-600 via-cyan-400 to-blue-600" />

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50 text-5xl">
                🛒
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Your Shopping Cart
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Your Cart is Empty
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                Looks like you have not added anything to your cart yet.
                Explore our collection and find something you like.
              </p>

              <Link
                href="/products"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
              >
                Start Shopping
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Shopping Cart
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Your Cart
              </h1>

              <p className="mt-3 text-base text-slate-500">
                Review your items before heading to checkout.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-xs font-medium text-slate-400">
                  Total Items
                </p>

                <p className="mt-1 text-2xl font-black text-slate-900">
                  {totalItems}
                </p>
              </div>

              <button
                type="button"
                onClick={clearCart}
                className="rounded-xl border border-red-200 bg-white px-5 py-3.5 text-sm font-bold text-red-600 transition duration-200 hover:border-red-300 hover:bg-red-50"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <section className="lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Cart Items
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {cart.length}{" "}
                  {cart.length === 1 ? "product" : "different products"}
                </p>
              </div>

              <Link
                href="/products"
                className="text-sm font-bold text-blue-600 transition hover:text-blue-700"
              >
                Continue Shopping →
              </Link>
            </div>

            <div className="space-y-5">
              {cart.map((item) => {
                const product = item.product;
                const itemTotal = product.price * item.quantity;

                const categoryName = getProductCategoryName(product);

                return (
                  <article
                    key={product._id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:border-blue-100 hover:shadow-lg"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-5 sm:flex-row">
                        {/* Product Image */}
                        <Link
                          href={`/products/${product._id}`}
                          className="relative h-36 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-32 sm:w-32"
                        >
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="(max-width: 640px) 100vw, 128px"
                              unoptimized
                              className="object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <div className="text-center">
                                <div className="text-3xl">🛍️</div>
                                <p className="mt-1 text-xs font-medium text-slate-400">
                                  No Image
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-linear-to-t from-slate-950/20 to-transparent opacity-0 transition group-hover:opacity-100" />
                        </Link>

                        {/* Product Info */}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                {categoryName}
                              </p>

                              <Link
                                href={`/products/${product._id}`}
                                className="mt-1 block truncate text-xl font-black text-slate-900 transition hover:text-blue-600"
                              >
                                {product.name}
                              </Link>

                              <p className="mt-2 text-sm text-slate-500">
                                ${product.price.toFixed(2)} per item
                              </p>
                            </div>

                            {/* Remove */}
                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(product._id)
                              }
                              aria-label={`Remove ${product.name} from cart`}
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                            {/* Quantity */}
                            <div>
                              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Quantity
                              </p>

                              <div className="flex h-11 items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                <button
                                  type="button"
                                  onClick={() =>
                                    decreaseQuantity(product._id)
                                  }
                                  className="flex h-full w-11 items-center justify-center text-lg font-bold text-slate-600 transition hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-slate-50"
                                >
                                  −
                                </button>

                                <span className="flex h-full min-w-12 items-center justify-center border-x border-slate-200 bg-white px-3 text-sm font-black text-slate-900">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    increaseQuantity(product._id)
                                  }
                                  disabled={item.quantity >= product.stock}
                                  aria-label={`Increase ${product.name} quantity`}
                                  className="flex h-full w-11 items-center justify-center text-lg font-bold text-slate-600 transition hover:bg-white hover:text-blue-600"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Item Total
                              </p>

                              <p className="mt-1 text-2xl font-black text-slate-900">
                                ${itemTotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Order Summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="h-1 bg-linear-to-r from-blue-600 via-cyan-400 to-blue-600" />

              <div className="p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                    🧾
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Order Summary
                    </h2>

                    <p className="text-xs text-slate-400">
                      Your purchase details
                    </p>
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Items
                    </span>

                    <span className="font-bold text-slate-900">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Subtotal
                    </span>

                    <span className="font-bold text-slate-900">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Delivery
                    </span>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                      Free
                    </span>
                  </div>
                </div>

                <div className="my-6 border-t border-dashed border-slate-200" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Total
                    </p>

                    <p className="mt-1 text-3xl font-black text-slate-900">
                      ${totalPrice.toFixed(2)}
                    </p>
                  </div>

                  <span className="mb-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                    USD
                  </span>
                </div>

                {/* Checkout */}
                <Link
                  href="/checkout"
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
                >
                  Proceed to Checkout
                  <span>→</span>
                </Link>

                {/* Continue Shopping */}
                <Link
                  href="/products"
                  className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-600 transition duration-200 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
                >
                  Continue Shopping
                </Link>

                {/* Trust */}
                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-6">
                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <div className="text-lg">🔒</div>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Secure
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <div className="text-lg">🚚</div>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Free Delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
