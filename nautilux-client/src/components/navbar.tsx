"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  FaHeart,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaHistory,
} from "react-icons/fa";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-blue-900 shadow-lg"
          : "bg-blue-900 md:bg-blue-900/90 md:backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-serif italic text-white">
            Nautilux
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/auctions"
              className="text-white hover:text-gray-200 transition-colors text-sm"
            >
              Auctions
            </Link>
            <Link
              href="/catalog"
              className="text-white hover:text-gray-200 transition-colors text-sm"
            >
              Catalog
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-gray-200 transition-colors text-sm"
            >
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-gray-200 transition-colors">
              <FaHeart className="w-4 h-4" />
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors text-sm">
                    <span className="font-light">{user?.firstName}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-1 py-1 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link
                      href="/profile"
                      className="block px-4 py-1.5 text-gray-800 hover:bg-gray-100 text-sm"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/my-bids"
                      className="block px-4 py-1.5 text-gray-800 hover:bg-gray-100 text-sm"
                    >
                      My Bids
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-1.5 text-red-600 hover:bg-gray-100 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/auth/sign-in"
                  className="px-3 py-1.5 text-white hover:text-gray-200 transition-colors border border-white/70 rounded text-sm hover:border-white hover:bg-white/10"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="px-3 py-1.5 bg-white text-blue-900 hover:bg-gray-100 transition-colors rounded shadow-sm font-medium text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              className="md:hidden text-white hover:text-gray-200 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <FaTimes className="w-5 h-5" />
              ) : (
                <FaBars className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-full max-w-xs bg-blue-900 shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-blue-800">
            <div className="flex justify-between items-center">
              <Link
                href="/"
                className="text-2xl font-serif italic text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nautilux
              </Link>
              <button
                className="text-white hover:text-gray-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
          </div>

          {isAuthenticated && (
            <div className="p-6 border-b border-blue-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center">
                  <span className="text-lg font-medium text-white">
                    {user?.firstName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-white">{user?.firstName}</p>
                  <p className="text-sm text-blue-200">View your profile</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="space-y-1">
              <Link
                href="/auctions"
                className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-blue-800 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-lg">Auctions</span>
              </Link>
              <Link
                href="/catalog"
                className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-blue-800 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-lg">Catalog</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-blue-800 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-lg">About</span>
              </Link>
            </div>

            {isAuthenticated ? (
              <div className="mt-6 space-y-1">
                <Link
                  href="/profile"
                  className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-blue-800 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/my-bids"
                  className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-blue-800 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaHistory className="w-5 h-5" />
                  <span>My Bids</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-red-300 hover:bg-blue-800 rounded-md transition-colors"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <Link
                  href="/auth/sign-in"
                  className="block w-full text-center px-4 py-3 border border-blue-700 text-white hover:bg-blue-800 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="block w-full text-center px-4 py-3 bg-white text-blue-900 hover:bg-gray-100 rounded-md shadow-sm transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-blue-800">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-200">© 2025 Nautilux</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
