"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import type { Product } from "@/types/product";
import type { CartItem } from "@/types/cart";

interface CartContextType {
  cart: CartItem[];
  hydrated: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null || !("product" in value)) {
    return false;
  }

  if (!("quantity" in value) || typeof value.quantity !== "number") {
    return false;
  }

  const product = value.product;
  return (
    typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) &&
    value.quantity > 0 &&
    typeof product === "object" &&
    product !== null &&
    "_id" in product &&
    typeof product._id === "string" &&
    "name" in product &&
    typeof product.name === "string" &&
    "price" in product &&
    typeof product.price === "number" &&
    "stock" in product &&
    typeof product.stock === "number"
  );
}

function getSavedCart(): CartItem[] {
  const savedCart = window.localStorage.getItem("minishop-cart");
  if (!savedCart) return [];

  try {
    const parsed: unknown = JSON.parse(savedCart);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>(() =>
    typeof window === "undefined" ? [] : getSavedCart()
  );
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot
  );

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      "minishop-cart",
      JSON.stringify(cart)
    );
  }, [cart, hydrated]);

  const addToCart = (product: Product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.product._id === product._id
      );

      if (product.stock <= 0) return currentCart;

      if (existingItem) {
        if (existingItem.quantity >= product.stock) return currentCart;
        return currentCart.map((item) =>
          item.product._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          product,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.product._id !== productId
      )
    );
  };

  const increaseQuantity = (productId: string) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.product._id === productId &&
        item.quantity < item.product.stock
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: string) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.product._id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        hydrated,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}