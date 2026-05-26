"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store/useStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initAuth = useStore((s) => s.initAuth);

  useEffect(() => {
    const unsubscribe = initAuth();
    return unsubscribe;
  }, [initAuth]);

  return <>{children}</>;
}
