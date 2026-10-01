import type { Category } from "@/types/category";
import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from "@/types/product";
import type { AuthResponse } from "@/types/user";
import type { CreateOrderInput, Order, OrderStatus } from "@/types/order";

const API_URL = "http://localhost:5000/api";

// ====================
// AUTH TOKEN
// ====================

const getAdminToken = (): string => {
  const token =
    typeof window === "undefined"
      ? null
      : localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  return token;
};

// ====================
// API RESPONSE HELPER
// ====================

const readApiResponse = async <T,>(
  response: Response,
  fallbackMessage: string
): Promise<T> => {
  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : fallbackMessage;

    throw new Error(message);
  }

  return data as T;
};

const authenticatedHeaders = (json = false): HeadersInit => ({
  ...(json ? { "Content-Type": "application/json" } : {}),
  Authorization: `Bearer ${getAdminToken()}`,
});

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return readApiResponse<AuthResponse>(response, "Login failed");
};

export const signup = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  return readApiResponse<AuthResponse>(response, "Failed to create account");
};

export const createOrder = async (
  orderData: CreateOrderInput
): Promise<Order> => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });

  return readApiResponse<Order>(response, "Failed to place order");
};

export const getOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_URL}/orders`, {
    headers: authenticatedHeaders(),
  });

  return readApiResponse<Order[]>(response, "Failed to fetch orders");
};

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus
): Promise<Order> => {
  const response = await fetch(`${API_URL}/orders/${id}/status`, {
    method: "PUT",
    headers: authenticatedHeaders(true),
    body: JSON.stringify({ status }),
  });

  return readApiResponse<Order>(response, "Failed to update order status");
};

// ====================
// CATEGORY API
// ====================

// Get categories
export const getCategories = async (
  token?: string
): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/categories`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  return readApiResponse<Category[]>(
    response,
    "Failed to fetch categories"
  );
};

// Create category
export const createCategory = async (
  name: string
): Promise<Category> => {
  const token = getAdminToken();

  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: name.trim(),
    }),
  });

  return readApiResponse<Category>(
    response,
    "Failed to create category"
  );
};

// Update category
export const updateCategory = async (
  id: string,
  name: string
): Promise<Category> => {
  const token = getAdminToken();

  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: name.trim(),
    }),
  });

  return readApiResponse<Category>(
    response,
    "Failed to update category"
  );
};

// Delete category
export const deleteCategory = async (
  id: string
): Promise<{ message: string }> => {
  const token = getAdminToken();

  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return readApiResponse<{ message: string }>(
    response,
    "Failed to delete category"
  );
};

// ====================
// PRODUCT API
// ====================

// Get all products
export const getProducts = async (
  search = "",
  category = ""
): Promise<Product[]> => {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  if (category) {
    params.append("category", category);
  }

  const query = params.toString();

  const url = query
    ? `${API_URL}/products?${query}`
    : `${API_URL}/products`;

  const response = await fetch(url);

  return readApiResponse<Product[]>(
    response,
    "Failed to fetch products"
  );
};

// Get single product
export const getProductById = async (
  id: string
): Promise<Product> => {
  const response = await fetch(
    `${API_URL}/products/${id}`
  );

  return readApiResponse<Product>(
    response,
    "Failed to fetch product"
  );
};

// Create product - ADMIN
export const createProduct = async (
  productData: CreateProductInput
): Promise<Product> => {
  const token = getAdminToken();

  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  return readApiResponse<Product>(
    response,
    "Failed to create product"
  );
};

// Update product - ADMIN
export const updateProduct = async (
  id: string,
  productData: UpdateProductInput
): Promise<Product> => {
  const token = getAdminToken();

  const response = await fetch(
    `${API_URL}/products/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    }
  );

  return readApiResponse<Product>(
    response,
    "Failed to update product"
  );
};

// Delete product - ADMIN
export const deleteProduct = async (
  id: string
): Promise<{ message: string }> => {
  const token = getAdminToken();

  const response = await fetch(
    `${API_URL}/products/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return readApiResponse<{ message: string }>(
    response,
    "Failed to delete product"
  );
};