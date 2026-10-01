"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProduct, getCategories } from "@/lib/api";
import type { Category } from "@/types/category";

export default function ProductForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const data = await getCategories();
        if (active) setCategories(data);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load categories."
          );
        }
      } finally {
        if (active) setLoadingCategories(false);
      }
    };

    void loadCategories();
    return () => {
      active = false;
    };
  }, []);

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
    if (!category) {
      setError("Select a category before creating the product.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await createProduct({
        name: name.trim(),
        price: numericPrice,
        description: description.trim(),
        image: image.trim(),
        category,
        stock: numericStock,
      });
      router.push("/admin/products");
      router.refresh();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to create product."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Store Catalog</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">Add Product</h1>
        </div>
        <Link href="/admin/products" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Back to Products</Link>
      </div>

      {error && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="new-product-name" className="mb-2 block font-medium text-slate-700">Product Name</label>
          <input id="new-product-name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter product name" required maxLength={160} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label htmlFor="new-product-price" className="mb-2 block font-medium text-slate-700">Price</label>
          <input id="new-product-price" type="number" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Enter price" min="0" step="0.01" required className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label htmlFor="new-product-description" className="mb-2 block font-medium text-slate-700">Description</label>
          <textarea id="new-product-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Enter product description" rows={4} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label htmlFor="new-product-image" className="mb-2 block font-medium text-slate-700">Image URL</label>
          <input id="new-product-image" type="url" value={image} onChange={(event) => setImage(event.target.value)} placeholder="Enter image URL" className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label htmlFor="new-product-category" className="mb-2 block font-medium text-slate-700">Category</label>
          <select id="new-product-category" value={category} onChange={(event) => setCategory(event.target.value)} required disabled={loadingCategories || categories.length === 0} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50">
            <option value="">{loadingCategories ? "Loading categories..." : "Select category"}</option>
            {categories.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
          </select>
          {!loadingCategories && categories.length === 0 && !error && <p className="mt-2 text-sm text-red-600">Create a category before adding a product.</p>}
        </div>
        <div>
          <label htmlFor="new-product-stock" className="mb-2 block font-medium text-slate-700">Stock</label>
          <input id="new-product-stock" type="number" value={stock} onChange={(event) => setStock(event.target.value)} placeholder="Enter stock quantity" min="0" step="1" required className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </div>
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
          <Link href="/admin/products" className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</Link>
          <button type="submit" disabled={saving || loadingCategories || categories.length === 0} className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            {saving ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </section>
  );
}
