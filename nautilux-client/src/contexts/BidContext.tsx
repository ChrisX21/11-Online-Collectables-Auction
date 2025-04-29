"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useSignalR } from "@/hooks/useSignalR";

type BidContextType = ReturnType<typeof useSignalR>;

// Create a context with a default value
const BidContext = createContext<BidContextType | null>(null);

// Provider component
export const BidProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const signalRService = useSignalR();

  return (
    <BidContext.Provider value={signalRService}>{children}</BidContext.Provider>
  );
};

// Custom hook to use the bid context
export const useBidContext = () => {
  const context = useContext(BidContext);
  if (!context) {
    throw new Error("useBidContext must be used within a BidProvider");
  }
  return context;
};
