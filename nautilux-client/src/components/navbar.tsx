"use client";

import React from "react";
import Image from "next/image";
import ThemeSwitcher from "./theme-switcher";
import { FaUser, FaSearch, FaHeart } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              Home
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

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-900 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white px-4 py-2 rounded-lg transition-colors">
                  <span>{user?.userName}</span>
                </button>
                <button
                  onClick={logout}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/sign-in"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
