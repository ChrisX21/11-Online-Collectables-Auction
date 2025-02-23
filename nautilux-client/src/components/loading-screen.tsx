"use client";

import Loading from "./loading";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <Loading size="large" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
