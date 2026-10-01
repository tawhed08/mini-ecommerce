
"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRef } from "react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/api";

export default function CheckoutPage() {
  const { cart, hydrated, clearCart } = useCart();

  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [placedSummary, setPlacedSummary] = useState<{
    totalItems: number;
    totalPrice: number;
  } | null>(null);
  const submitting = useRef(false);

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex min-h-80 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  🧾
                </div>

                <p className="mt-4 text-sm font-medium text-slate-500">
                  Loading checkout...
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

  // Order placed successfully
  if (placed) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-1 bg-linear-to-r from-emerald-500 via-green-400 to-emerald-500" />

            <div className="px-6 py-16 text-center sm:px-10 sm:py-20">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-5xl">
                ✓
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                Order Confirmed
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Thank You for Your Order!
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                Your order has been placed successfully. We&apos;ll process
                your order and get it ready for delivery.
              </p>

              <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Items
                  </span>

                  <span className="font-bold text-slate-900">
                    {placedSummary?.totalItems ?? totalItems}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Total
                  </span>

                  <span className="text-xl font-black text-slate-900">
                    ${(placedSummary?.totalPrice ?? totalPrice).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Continue Shopping
                  <span>→</span>
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 transition hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-1 bg-linear-to-r from-blue-600 via-cyan-400 to-blue-600" />

            <div className="px-6 py-16 text-center sm:px-10 sm:py-20">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50 text-5xl">
                🛒
              </div>

              <h1 className="mt-7 text-3xl font-black text-slate-900">
                Your Cart is Empty
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                You need to add some products to your cart before checking
                out.
              </p>

              <Link
                href="/products"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Browse Products
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current || cart.length === 0) return;

    submitting.current = true;
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const customer = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      address: String(formData.get("address") || ""),
    };

    const orderData = {
      customer,
      items: cart.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
      totalItems,
      totalPrice,
    };

    try {
      await createOrder(orderData);
      setPlacedSummary({ totalItems, totalPrice });
      setPlaced(true);
      clearCart();
    } catch (error) {
      console.error("Place order error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to place order"
      );
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              🧾
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Secure Checkout
              </p>

              <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Complete Your Order
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Enter your information and confirm your purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
        <form
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-3"
        >
          {/* Customer Information */}
          <section className="lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg">
                    👤
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Customer Information
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Tell us where we should deliver your order.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6 sm:p-8">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* Email + Phone */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-bold text-slate-700"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="Enter your phone number"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Delivery Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={5}
                    placeholder="Enter your complete delivery address"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* Security Notice */}
                <div className="flex gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                    🔒
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Your information is protected
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your customer information is used only to process and
                      deliver your order.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg">
                    ⚠️
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-red-700">
                      Unable to place order
                    </h3>

                    <p className="mt-1 text-sm text-red-600">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Order Summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="h-1 bg-linear-to-r from-blue-600 via-cyan-400 to-blue-600" />

              <div className="p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                    🛍️
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Your Order
                    </h2>

                    <p className="text-xs text-slate-400">
                      {totalItems}{" "}
                      {totalItems === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>

                {/* Products */}
                <div className="mt-6 max-h-72 space-y-4 overflow-y-auto pr-1">
                  {cart.map((item) => {
                    const product = item.product;
                    const itemTotal =
                      product.price * item.quantity;

                    return (
                      <div
                        key={product._id}
                        className="flex gap-3"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="64px"
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-lg">
                              🛍️
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-bold text-slate-900">
                            {product.name}
                          </h3>

                          <p className="mt-1 text-xs text-slate-400">
                            ${product.price.toFixed(2)} ×{" "}
                            {item.quantity}
                          </p>

                          <p className="mt-1 text-sm font-black text-blue-600">
                            ${itemTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="my-6 border-t border-dashed border-slate-200" />

                {/* Summary */}
                <div className="space-y-4">
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

                <div className="my-6 border-t border-slate-200" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Total Amount
                    </p>

                    <p className="mt-1 text-3xl font-black text-slate-900">
                      ${totalPrice.toFixed(2)}
                    </p>
                  </div>

                  <span className="mb-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                    USD
                  </span>
                </div>

                {/* Place Order */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-bold text-white shadow-lg transition duration-300 ${
                    loading
                      ? "cursor-not-allowed bg-slate-400 shadow-none"
                      : "bg-blue-600 shadow-blue-600/20 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order
                      <span>→</span>
                    </>
                  )}
                </button>

                <Link
                  href="/cart"
                  className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-600 transition hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
                >
                  ← Back to Cart
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
        </form>
      </div>
    </main>
  );
}
