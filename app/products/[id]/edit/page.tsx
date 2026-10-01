"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import {
  getCategories,
  getProductById,
  updateProduct,
} from "@/lib/api";
import type { Category } from "@/types/category";

export default function EditProductPage() {
  return (
    <AdminGuard>
      <EditProductContent />
    </AdminGuard>
  );
}

function EditProductContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const [product, categoryData] = await Promise.all([
          getProductById(id),
          getCategories(),
        ]);

        if (!active) return;
        setCategories(categoryData);
        setName(product.name);
        setPrice(String(product.price));
        setDescription(product.description);
        setImage(product.image);
        setCategory(
          typeof product.category === "object" && product.category
            ? product.category._id
            : typeof product.category === "string"
              ? product.category
              : ""
        );
        setStock(String(product.stock));
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load product."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadData();
    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    const numericPrice = Number(price);
    const numericStock = Number(stock);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setError("Enter a valid price of zero or more.");
      return;
    }
    if (!Number.isInteger(numericStock) || numericStock < 0) {
      setError("Stock must be a whole number of zero or more.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await updateProduct(id, {
        name: name.trim(),
        price: numericPrice,
        description: description.trim(),
        image: image.trim(),
        category,
        stock: numericStock,
      });
      router.push(`/products/${id}`);
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-2xl py-20 text-center text-sm text-slate-500">
          Loading product...
        </div>
      </main>
    );
  }

  if (error && !name) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-8 text-center">
          <p role="alert" className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => router.push(`/products/${id}`)}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            Back to Product
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => router.push(`/products/${id}`)}
          className="mb-6 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Product
        </button>
        <h1 className="mb-8 text-3xl font-black text-slate-900">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <label htmlFor="product-name" className="mb-2 block font-medium text-slate-700">Product Name</label>
            <input id="product-name" type="text" value={name} onChange={(event) => setName(event.target.value)} required maxLength={160} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label htmlFor="product-price" className="mb-2 block font-medium text-slate-700">Price</label>
            <input id="product-price" type="number" value={price} onChange={(event) => setPrice(event.target.value)} min="0" step="0.01" required className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label htmlFor="product-description" className="mb-2 block font-medium text-slate-700">Description</label>
            <textarea id="product-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={5} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label htmlFor="product-image" className="mb-2 block font-medium text-slate-700">Image URL</label>
            <input id="product-image" type="url" value={image} onChange={(event) => setImage(event.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label htmlFor="product-category" className="mb-2 block font-medium text-slate-700">Category</label>
            <select id="product-category" value={category} onChange={(event) => setCategory(event.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
              <option value="">Select category</option>
              {categories.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="product-stock" className="mb-2 block font-medium text-slate-700">Stock</label>
            <input id="product-stock" type="number" value={stock} onChange={(event) => setStock(event.target.value)} min="0" step="1" required className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? "Updating..." : "Update Product"}
            </button>
            <button type="button" onClick={() => router.push(`/products/${id}`)} disabled={saving} className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
