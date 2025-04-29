"use client";

import React from "react";
import { Tooltip } from "@/components/ui/tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ConnectionStatus =
  | "connected"
  | "connecting"
  | "disconnected"
  | "reconnecting";

interface ConnectionStatusProps {
  status: ConnectionStatus;
  className?: string;
}

export function ConnectionStatus({ status, className }: ConnectionStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500 animate-pulse";
      case "reconnecting":
        return "bg-yellow-500 animate-pulse";
      case "disconnected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Real-time updates connected";
      case "connecting":
        return "Connecting to real-time updates...";
      case "reconnecting":
        return "Reconnecting to real-time updates...";
      case "disconnected":
        return "Real-time updates disconnected. You may need to refresh the page.";
      default:
        return "Connection status unknown";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-2", className)}>
            <div className={cn("h-2 w-2 rounded-full", getStatusColor())} />
            <span className="text-xs text-muted-foreground">
              {status === "connected" ? "Live" : status}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getStatusText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
