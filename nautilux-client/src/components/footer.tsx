"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-serif italic">Nautilux</h2>
            </Link>
            <p className="text-gray-300 text-sm">
              Curating the world's finest maritime artifacts and historical
              treasures.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://facebook.com"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaLinkedinIn className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-base font-medium mb-4">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/auctions"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Auctions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalog"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Catalog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sell"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Sell With Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="text-gray-400">Email:</span>
              <span className="ml-2 text-gray-300">contact@nautilux.com</span>
            </div>
            <div>
              <span className="text-gray-400">Phone:</span>
              <span className="ml-2 text-gray-300">+359 (888) 888-888</span>
            </div>
            <div>
              <span className="text-gray-400">Location:</span>
              <span className="ml-2 text-gray-300">Sofia, Bulgaria</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-800 pt-6">
          <div className="flex justify-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Nautilux Collectibles. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
