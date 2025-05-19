"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="min-h-screen bg-blue-900 text-white overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <Image
          src="/images/compass.jpg"
          alt="Maritime background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Waves animation at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden z-0">
        <svg
          className="absolute bottom-0 w-full h-64"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="rgba(255, 255, 255, 0.1)"
            d="M0,160L48,133.3C96,107,192,53,288,48C384,43,480,85,576,96C672,107,768,85,864,85.3C960,85,1056,107,1152,117.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
        <svg
          className="absolute bottom-0 w-full h-64"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="rgba(255, 255, 255, 0.05)"
            d="M0,192L48,186.7C96,181,192,171,288,186.7C384,203,480,245,576,250.7C672,256,768,224,864,213.3C960,203,1056,213,1152,224C1248,235,1344,245,1392,250.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-3xl mx-auto text-center">
          {/* Compass icon */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-full h-full transition-opacity duration-1000 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
          </div>

          <h1
            className={`text-6xl md:text-8xl font-light mb-8 transition-transform duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            404
            <span className="font-serif italic block mt-2">Lost at Sea</span>
          </h1>

          <p
            className={`text-xl text-blue-100 mb-12 max-w-2xl mx-auto transition-opacity duration-1000 delay-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            The treasure you're searching for seems to have drifted away.
            Perhaps the tide has carried it elsewhere, or it was just a mirage
            on the horizon.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center transition-opacity duration-1000 delay-500 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link
              href="/"
              className="group relative px-8 py-4 bg-white text-blue-900 hover:bg-blue-950 hover:text-white transition-all duration-300"
            >
              <span className="relative z-10">Return to Shore</span>
              <div className="absolute inset-0 border border-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/auctions"
              className="px-8 py-4 border border-white text-white hover:bg-white hover:text-blue-900 transition-all duration-300"
            >
              Browse Auctions
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
