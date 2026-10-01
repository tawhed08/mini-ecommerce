import { Suspense } from "react";
import ProductsListing from "./ProductsListing";

function ProductsFallback() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="h-12 w-72 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded bg-slate-100" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="h-20 animate-pulse rounded-3xl bg-white" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="h-105 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsListing />
    </Suspense>
  );
}
