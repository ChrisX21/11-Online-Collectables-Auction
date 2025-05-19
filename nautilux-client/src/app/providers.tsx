"use client";

import { ReactNode, useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Toaster } from "react-hot-toast";
import { startAuctionStatusChecker } from "@/utils/auctionStatusChecker";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const stopChecker = startAuctionStatusChecker(5);

    return () => {
      stopChecker();
    };
  }, []);

  return (
    <AuthProvider>
      <FavoritesProvider>
        {children}
        <Toaster position="top-right" />
      </FavoritesProvider>
    </AuthProvider>
  );
}
