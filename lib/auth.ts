import type { AuthResponse, User } from "@/types/user";

export const AUTH_CHANGE_EVENT = "minishop:auth-change";

let cachedUserValue: string | null | undefined;
let cachedUser: User | null = null;

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;

  const savedUser = window.localStorage.getItem("user");
  if (savedUser === cachedUserValue) return cachedUser;
  cachedUserValue = savedUser;

  if (!savedUser) {
    cachedUser = null;
    return cachedUser;
  }

  try {
    const value: unknown = JSON.parse(savedUser);
    if (
      typeof value === "object" &&
      value !== null &&
      "id" in value &&
      typeof value.id === "string" &&
      "name" in value &&
      typeof value.name === "string" &&
      "email" in value &&
      typeof value.email === "string" &&
      "role" in value &&
      (value.role === "admin" || value.role === "user")
    ) {
      cachedUser = {
        id: value.id,
        name: value.name,
        email: value.email,
        role: value.role,
      };
      return cachedUser;
    }
  } catch {
    cachedUser = null;
    return cachedUser;
  }

  cachedUser = null;
  return cachedUser;
}

export function saveAuthSession({ token, user }: AuthResponse): void {
  window.localStorage.setItem("token", token);
  window.localStorage.setItem("user", JSON.stringify(user));
  cachedUserValue = undefined;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearAuthSession(): void {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
  cachedUserValue = undefined;
  cachedUser = null;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function subscribeToAuthChanges(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
  };
}