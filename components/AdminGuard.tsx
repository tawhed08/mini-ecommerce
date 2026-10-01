"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import {
  getCurrentUser,
  subscribeToAuthChanges,
} from "@/lib/auth";

export default function AdminGuard({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const user = useSyncExternalStore(
    subscribeToAuthChanges,
    getCurrentUser,
    () => null
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/");
    }
  }, [router, user]);

  if (user?.role !== "admin") {
    return (
      <main className="min-h-[50vh] bg-slate-50 px-6 py-20 text-center text-sm font-medium text-slate-500">
        Checking administrator access...
      </main>
    );
  }

  return <>{children}</>;
}