"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import AdminGuard from "@/components/AdminGuard";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/lib/api";
import type { Category } from "@/types/category";

export default function AdminCategoriesPage() {
  return (
    <AdminGuard>
      <CategoryManagement />
    </AdminGuard>
  );
}

function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCategories = useCallback(
    (): Promise<void> =>
      Promise.resolve()
        .then(async () => {
          const token = localStorage.getItem("token");

          if (!token) {
            throw new Error("Authentication required");
          }

          setCategories(await getCategories(token));
        })
        .catch((fetchError: unknown) => {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load categories."
          );
        })
        .finally(() => setLoading(false)),
    []
  );

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    setSuccess("");
    void fetchCategories();
  };

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      setSuccess("");
      return;
    }

    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const category = await createCategory(trimmedName);
      setCategories((current) =>
        [...current, category].sort((first, second) =>
          first.name.localeCompare(second.name)
        )
      );
      setName("");
      setSuccess("Category created successfully.");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to create category."
      );
    } finally {
      setCreating(false);
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category._id);
    setEditName(category.name);
    setError("");
    setSuccess("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleUpdate = async (
    event: FormEvent<HTMLFormElement>,
    categoryId: string
  ) => {
    event.preventDefault();
    const trimmedName = editName.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      setSuccess("");
      return;
    }

    setSavingId(categoryId);
    setError("");
    setSuccess("");

    try {
      const updatedCategory = await updateCategory(categoryId, trimmedName);
      setCategories((current) =>
        current
          .map((category) =>
            category._id === categoryId ? updatedCategory : category
          )
          .sort((first, second) => first.name.localeCompare(second.name))
      );
      cancelEditing();
      setSuccess("Category updated successfully.");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update category."
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(
      `Delete the category "${category.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(category._id);
    setError("");
    setSuccess("");

    try {
      await deleteCategory(category._id);
      setCategories((current) =>
        current.filter((item) => item._id !== category._id)
      );
      setSuccess("Category deleted successfully.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete category."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-3 inline-flex text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              ← Back to Dashboard
            </Link>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Store Catalog
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Category Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Create, rename, and remove product categories.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span aria-hidden="true">↻</span>
            {loading ? "Refreshing..." : "Refresh categories"}
          </button>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-5 flex flex-col gap-3 rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={handleRefresh}
              className="shrink-0 font-bold text-red-700 underline decoration-red-300 underline-offset-4 hover:text-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {success && (
          <p
            role="status"
            className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
          >
            {success}
          </p>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-slate-900">
              Add a category
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Category names must be unique.
            </p>
          </div>
          <form
            onSubmit={(event) => void handleCreate(event)}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="new-category-name">
              Category name
            </label>
            <input
              id="new-category-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Accessories"
              maxLength={80}
              required
              className="min-h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="submit"
              disabled={creating}
              className="min-h-12 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? "Adding..." : "Add category"}
            </button>
          </form>
        </section>

        <section className="mt-7">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Categories
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading categories..."
                  : `${categories.length} ${categories.length === 1 ? "category" : "categories"}`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3" aria-label="Loading categories">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="h-5 w-1/3 rounded bg-slate-200" />
                  <div className="mt-3 h-3 w-1/2 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : categories.length === 0 && !error ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-700">
                ▦
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                No categories yet
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Add your first category above to organize products in the store.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <article
                  key={category._id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 sm:p-5"
                >
                  {editingId === category._id ? (
                    <form
                      onSubmit={(event) =>
                        void handleUpdate(event, category._id)
                      }
                      className="flex flex-col gap-3 sm:flex-row sm:items-center"
                    >
                      <label
                        className="sr-only"
                        htmlFor={`edit-category-${category._id}`}
                      >
                        Edit category name
                      </label>
                      <input
                        id={`edit-category-${category._id}`}
                        type="text"
                        value={editName}
                        onChange={(event) => setEditName(event.target.value)}
                        maxLength={80}
                        required
                        autoFocus
                        className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={savingId === category._id}
                          className="min-h-11 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                          {savingId === category._id ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          disabled={savingId === category._id}
                          className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="break-words font-bold text-slate-900">
                          {category.name}
                        </h3>
                        <p
                          title={category._id}
                          className="mt-1 truncate font-mono text-xs text-slate-400"
                        >
                          ID: {category._id}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Link
                          href={`/products?category=${encodeURIComponent(category._id)}`}
                          className="inline-flex min-h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => startEditing(category)}
                          disabled={savingId !== null || deletingId !== null}
                          className="min-h-10 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(category)}
                          disabled={deletingId !== null || savingId !== null}
                          className="min-h-10 rounded-xl border border-red-100 bg-red-50 px-4 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          {deletingId === category._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}