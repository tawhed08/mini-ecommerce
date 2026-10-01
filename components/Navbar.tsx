
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { useCart } from "@/context/CartContext";
import {
  clearAuthSession,
  getCurrentUser,
  subscribeToAuthChanges,
} from "@/lib/auth";

const links = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/categories" },
];

const adminLinks = [
  { name: "Products", href: "/admin/products" },
  { name: "Categories", href: "/admin/categories" },
  { name: "Orders", href: "/admin/orders" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const user = useSyncExternalStore(
    subscribeToAuthChanges,
    getCurrentUser,
    () => null
  );

  const { cart, hydrated } = useCart();

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const navigationLinks =
    user?.role === "admin"
      ? [
          ...links,
          { name: "Dashboard", href: "/admin" },
        ]
      : links;

  const handleLogout = () => {
    clearAuthSession();
    setIsOpen(false);

    router.push("/");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/admin") return pathname === "/admin";

    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="group flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-400 text-lg shadow-lg shadow-blue-500/20 transition duration-300 group-hover:scale-105">
              🛍️
            </div>

            <div className="leading-none">
              <span className="text-xl font-black tracking-tight text-slate-900">
                Mini
              </span>

              <span className="text-xl font-black tracking-tight text-blue-600">
                Shop
              </span>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Shop smarter
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {navigationLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  {link.name}

                  {active && (
                    <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-600" />
                  )}
                </Link>
              );
            })}
            {user?.role === "admin" && (
              <details className="group relative">
                <summary className="cursor-pointer list-none rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-blue-600">
                  Admin <span aria-hidden="true">⌄</span>
                </summary>
                <div className="absolute right-0 top-full z-10 mt-2 min-w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  {adminLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                        isActive(link.href)
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </details>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              href="/cart"
              className={`group relative flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition duration-200 ${
                isActive("/cart")
                  ? "border-blue-100 bg-blue-50 text-blue-600"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span className="text-lg transition-transform duration-200 group-hover:scale-110">
                🛒
              </span>

              <span className="hidden sm:inline">Cart</span>

              {hydrated && cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Desktop Auth */}
            {user ? (
              <div className="hidden items-center gap-2 md:flex">
                <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  <span className="max-w-28 truncate text-sm font-bold text-slate-700">
                    {user.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="h-11 rounded-xl border border-red-100 bg-red-50 px-4 text-sm font-bold text-red-600 transition hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href="/login"
                  className="flex h-11 items-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex h-11 items-center rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600 lg:hidden"
            >
              {isOpen ? (
                <span className="text-xl">✕</span>
              ) : (
                <span className="text-xl">☰</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden transition-all duration-300 lg:hidden ${
            isOpen
              ? "max-h-160 pb-5 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-slate-100 pt-4">
            <div className="flex flex-col gap-1">
              {/* Mobile Navigation */}
              {navigationLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {user?.role === "admin" && adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive(link.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  Admin {link.name}
                </Link>
              ))}

              {/* Mobile Cart */}
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className={`mt-1 flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive("/cart")
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                <span>🛒 Cart</span>

                {hydrated && cartCount > 0 && (
                  <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Auth */}
              {user ? (
                <div className="mt-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 w-full rounded-xl bg-red-50 px-4 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mt-2 border-t border-slate-100 pt-3">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
