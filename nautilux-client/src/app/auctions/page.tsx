"use client";
import { useState, useEffect } from "react";
import Loading from "@/components/loading";
import AuctionCard, { AuctionItem } from "@/components/AuctionCard";
import Link from "next/link";
import api from "@/utils/axios";

// Filter types for the auction list
type FilterType = "all" | "ending-soon" | "newly-listed" | "high-value";

export default function Auctions() {
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<
    "default" | "price-high" | "price-low" | "ending-soon"
  >("default");

  useEffect(() => {
    async function fetchAuctions() {
      try {
        const response = await api.get("/listings/active");
        setAuctions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch auctions:", error);
        setLoading(false);
      }
    }
    fetchAuctions();
  }, []);

  // Filter auctions based on search and filter criteria
  const filteredAuctions = auctions
    .filter((auction) => {
      // Search filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          auction.title.toLowerCase().includes(query) ||
          auction.description.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((auction) => {
      // Category filters
      const now = new Date();
      const endDate = new Date(auction.endDate);
      const timeRemaining = endDate.getTime() - now.getTime();
      const hoursRemaining = timeRemaining / (1000 * 60 * 60);

      switch (activeFilter) {
        case "ending-soon":
          return hoursRemaining <= 24; // Less than 24 hours remaining
        case "newly-listed":
          // In real implementation, you'd check listing date
          // For mock data, we'll just use the first 3 items
          return [1, 2, 3].includes(auction.id);
        case "high-value":
          return auction.currentBid
            ? auction.currentBid.amount > 1000
            : auction.startingPrice > 1000;
        case "all":
        default:
          return true;
      }
    })
    .sort((a, b) => {
      // Sorting options
      const aPrice = a.currentBid ? a.currentBid.amount : a.startingPrice;
      const bPrice = b.currentBid ? b.currentBid.amount : b.startingPrice;

      switch (sortBy) {
        case "price-high":
          return bPrice - aPrice;
        case "price-low":
          return aPrice - bPrice;
        case "ending-soon":
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        default:
          return 0; // Keep original order
      }
    });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="relative py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
              Maritime
              <span className="font-serif italic block mt-2">Collectibles</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 font-light">
              Discover authentic maritime artifacts from collectors around the
              world
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-md">
                <div className="text-3xl font-light">{auctions.length}</div>
                <div className="text-sm text-gray-300">Active Auctions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-md">
                <div className="text-3xl font-light">98%</div>
                <div className="text-sm text-gray-300">Authentication Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-md">
                <div className="text-3xl font-light">24h</div>
                <div className="text-sm text-gray-300">Average Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Search and filter controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-10 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-3.5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-shrink-0">
              <select
                className="px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black appearance-none bg-white pr-8 pl-4"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1rem",
                }}
              >
                <option value="default">Featured</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="ending-soon">Ending Soon</option>
              </select>
            </div>
          </div>

          {/* Filter buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              className={`py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                activeFilter === "all"
                  ? "bg-black text-white"
                  : "bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200"
              }`}
              onClick={() => setActiveFilter("all")}
            >
              All Items
            </button>
            <button
              className={`py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                activeFilter === "ending-soon"
                  ? "bg-black text-white"
                  : "bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200"
              }`}
              onClick={() => setActiveFilter("ending-soon")}
            >
              Ending Soon
            </button>
            <button
              className={`py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                activeFilter === "newly-listed"
                  ? "bg-black text-white"
                  : "bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200"
              }`}
              onClick={() => setActiveFilter("newly-listed")}
            >
              Newly Listed
            </button>
            <button
              className={`py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                activeFilter === "high-value"
                  ? "bg-black text-white"
                  : "bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200"
              }`}
              onClick={() => setActiveFilter("high-value")}
            >
              High Value
            </button>
          </div>
        </div>

        {/* Auctions Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loading />
          </div>
        ) : filteredAuctions.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-light mb-4">No auctions found</h3>
            <p className="text-gray-500 mb-8">
              Try adjusting your search or filter settings
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
                setSortBy("default");
              }}
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAuctions.map((auction) => (
              <AuctionCard key={auction.id} item={auction} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
