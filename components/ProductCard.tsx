
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { getProductCategoryName } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const categoryName = getProductCategoryName(product);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-100 hover:shadow-2xl hover:shadow-slate-200/70">
      {/* Product Image */}
      <div className="relative h-60 overflow-hidden bg-slate-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            unoptimized
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="text-4xl">🛍️</div>
              <p className="mt-2 text-sm font-medium text-slate-400">
                No Image
              </p>
            </div>
          </div>
        )}

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

        {/* Category Badge */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full border border-white/50 bg-white/90 px-3 py-1.5 text-xs font-bold text-blue-600 shadow-sm backdrop-blur">
            {categoryName}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute right-4 top-4">
          {isOutOfStock ? (
            <span className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              Only {product.stock} left
            </span>
          ) : (
            <span className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          {categoryName}
        </p>

        <h2 className="mt-2 line-clamp-1 text-lg font-black text-slate-900 transition group-hover:text-blue-600">
          {product.name}
        </h2>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
          {product.description || "No description available."}
        </p>

        {/* Price & Stock */}
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">
              Price
            </p>

            <p className="mt-1 text-2xl font-black text-slate-900">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-medium text-slate-400">
              Available
            </p>

            <p
              className={`mt-1 text-sm font-bold ${
                isOutOfStock
                  ? "text-red-500"
                  : isLowStock
                    ? "text-amber-500"
                    : "text-emerald-600"
              }`}
            >
              {product.stock} units
            </p>
          </div>
        </div>

        {/* View Details Button */}
        <Link
          href={`/products/${product._id}`}
          className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-blue-600 bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-700 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20"
        >
          View Details
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
