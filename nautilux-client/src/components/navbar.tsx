import React from "react";
import Image from "next/image";
import ThemeSwitcher from "./theme-switcher";
import { FaUser, FaSearch, FaHeart } from "react-icons/fa";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Primary Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Nautilux Auctions"
                width={150}
                height={60}
                className="object-contain"
              />
            </Link>

            {/* Main Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/auctions"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Active Auctions
              </Link>
              <Link
                href="/catalog"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Catalog
              </Link>
              <Link
                href="/how-it-works"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            <button className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <FaSearch className="w-5 h-5" />
            </button>
            <button className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <FaHeart className="w-5 h-5" />
            </button>
            <ThemeSwitcher />
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <FaUser className="w-4 h-4" />
              <span className="hidden sm:inline">Account</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
