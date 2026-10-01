"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import { getOrders, updateOrderStatus } from "@/lib/api";
import type { Order, OrderStatus } from "@/types/order";

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function AdminOrdersPage() {
  return (
    <AdminGuard>
      <OrdersContent />
    </AdminGuard>
  );
}

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");

  const fetchOrders = useCallback(async () => {
    try {
      setOrders(await getOrders());
      setError("");
    } catch (loadError) {
      setOrders([]);
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await getOrders();
        if (active) {
          setOrders(data);
          setError("");
        }
      } catch (loadError) {
        if (active) {
          setOrders([]);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load orders."
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
  }, []);

  const changeStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    setError("");
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders((current) =>
        current.map((order) => order._id === orderId ? updatedOrder : order)
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !normalizedSearch ||
      order._id.toLowerCase().includes(normalizedSearch) ||
      order.customer.name.toLowerCase().includes(normalizedSearch) ||
      order.customer.email.toLowerCase().includes(normalizedSearch);
    return matchesSearch && (statusFilter === "all" || order.status === statusFilter);
  });
  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((total, order) => total + order.totalPrice, 0);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/admin" className="mb-3 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700">← Back to Dashboard</Link>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Admin Panel</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Orders</h1>
            <p className="mt-1 text-sm text-slate-500">Manage and monitor customer orders.</p>
          </div>
          <button type="button" onClick={() => { setLoading(true); void fetchOrders(); }} disabled={loading} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 disabled:opacity-60">
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </header>

        <section className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Order totals">
          <Stat label="Total Orders" value={orders.length} />
          <Stat label="Pending" value={orders.filter((order) => order.status === "pending").length} />
          <Stat label="Delivered" value={orders.filter((order) => order.status === "delivered").length} />
          <Stat label="Revenue" value={`৳${revenue.toLocaleString()}`} />
        </section>

        {error && (
          <div role="alert" className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <button type="button" onClick={() => { setLoading(true); void fetchOrders(); }} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">Try Again</button>
          </div>
        )}

        <div className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
          <label className="sr-only" htmlFor="orders-search">Search orders</label>
          <input id="orders-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by order ID, customer name or email..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
          <label className="sr-only" htmlFor="orders-status">Filter by status</label>
          <select id="orders-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | OrderStatus)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500">
            <option value="all">All Statuses</option>
            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-4" aria-label="Loading orders">
            {[0, 1, 2].map((item) => <div key={item} className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white" />)}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="text-5xl">📦</div>
            <h2 className="mt-4 text-xl font-black text-slate-900">No Orders Found</h2>
            <p className="mt-2 text-sm text-slate-500">{orders.length ? "No orders match these filters." : "There are no orders yet."}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <article key={order._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <header className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Order ID</p>
                    <p className="mt-1 break-all font-mono text-sm font-bold text-slate-900">#{order._id}</p>
                    <time dateTime={order.createdAt} className="mt-1 block text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC
                    </time>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyles[order.status]}`}>{order.status}</span>
                    <label className="sr-only" htmlFor={`status-${order._id}`}>Update order status</label>
                    <select id={`status-${order._id}`} value={order.status} disabled={updatingId === order._id} onChange={(event) => void changeStatus(order._id, event.target.value as OrderStatus)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 disabled:opacity-60">
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                </header>
                <div className="grid gap-6 p-5 lg:grid-cols-3">
                  <section>
                    <h2 className="mb-3 text-sm font-black text-slate-900">Customer</h2>
                    <p className="font-bold text-slate-800">{order.customer.name}</p>
                    <p className="mt-1 break-all text-sm text-slate-500">{order.customer.email}</p>
                    <p className="mt-1 text-sm text-slate-500">{order.customer.phone}</p>
                    <p className="mt-1 text-sm text-slate-500">{order.customer.address}</p>
                  </section>
                  <section>
                    <h2 className="mb-3 text-sm font-black text-slate-900">Products</h2>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={`${order._id}-${index}`} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-800">{typeof item.product === "object" && item.product ? item.product.name : item.name}</p>
                            <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="shrink-0 text-sm font-bold text-slate-900">৳{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section>
                    <h2 className="mb-3 text-sm font-black text-slate-900">Order Summary</h2>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex justify-between py-2 text-sm"><span className="text-slate-500">Total Items</span><span className="font-bold text-slate-800">{order.totalItems}</span></div>
                      <div className="my-2 h-px bg-slate-200" />
                      <div className="flex items-center justify-between"><span className="font-bold text-slate-700">Total</span><span className="text-xl font-black text-blue-600">৳{order.totalPrice.toLocaleString()}</span></div>
                    </div>
                  </section>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}
