"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { getCategories, getOrders, getProducts } from "@/lib/api";
import type { Order, OrderStatus } from "@/types/order";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}

function DashboardContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadDashboard = async () => {
      try {
        const [ordersData, productsData, categoriesData] = await Promise.all([
          getOrders(),
          getProducts(),
          getCategories(),
        ]);
        if (active) {
          setOrders(ordersData);
          setProducts(productsData);
          setCategories(categoriesData);
          setError("");
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load dashboard data."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const totalRevenue = orders.reduce(
    (total, order) => total + order.totalPrice,
    0
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600" />

                <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Admin Panel
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Welcome back. Here is what is happening in your store.
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 hover:shadow-lg"
            >
              View All Orders →
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Products"
            value={loading ? "—" : products.length}
            icon="📦"
            description="Products in store"
          />

          <DashboardCard
            title="Total Orders"
            value={loading ? "—" : orders.length}
            icon="🛒"
            description="Customer orders"
          />

          <DashboardCard
            title="Total Revenue"
            value={
              loading
                ? "—"
                : `৳${totalRevenue.toLocaleString()}`
            }
            icon="💰"
            description="Total order value"
          />

          <DashboardCard
            title="Categories"
            value={loading ? "—" : categories.length}
            icon="🗂️"
            description="Active categories"
          />
        </div>

        {/* Order overview */}
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Orders
                </p>

                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  {loading ? "—" : pendingOrders}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-xl">
                ⏳
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{
                  width:
                    orders.length > 0
                      ? `${(pendingOrders / orders.length) * 100}%`
                      : "0%",
                }}
              />
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Orders waiting for action
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Delivered Orders
                </p>

                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  {loading ? "—" : deliveredOrders}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                ✓
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width:
                    orders.length > 0
                      ? `${(deliveredOrders / orders.length) * 100}%`
                      : "0%",
                }}
              />
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Successfully delivered
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Store Status
                </p>

                <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                  Online
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Your store APIs are connected and ready.
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest customer activity
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading dashboard...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="text-4xl">📦</div>

              <h3 className="mt-3 font-bold text-slate-900">
                No orders yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order._id}
                    className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                        🛍️
                      </div>

                      <div>
                        <p className="font-bold text-slate-900">
                          {order.customer.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {order.customer.email}
                        </p>

                        <p className="mt-1 font-mono text-[11px] text-slate-400">
                          #{order._id.slice(-8)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-slate-400">
                          {order.totalItems} item
                          {order.totalItems !== 1 ? "s" : ""}
                        </p>

                        <p className="mt-1 font-bold text-slate-900">
                          ৳{order.totalPrice.toLocaleString()}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                          statusStyles[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickAction
              href="/admin/orders"
              icon="📋"
              title="Manage Orders"
              description="View and update customer orders"
            />

            <QuickAction
              href="/admin/categories"
              icon="🗂️"
              title="Manage Categories"
              description="Create and organize product categories"
            />

            <QuickAction
              href="/products"
              icon="🛍️"
              title="View Products"
              description="Browse products in your store"
            />

            <QuickAction
              href="/products/add"
              icon="＋"
              title="Add Product"
              description="Create a new store product"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-lg transition group-hover:bg-blue-50">
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-xl transition group-hover:bg-blue-50">
          {icon}
        </div>

        <div>
          <h3 className="font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <span className="ml-auto text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
          →
        </span>
      </div>
    </Link>
  );
}