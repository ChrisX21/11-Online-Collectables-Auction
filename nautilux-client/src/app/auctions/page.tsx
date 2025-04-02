"use client";
import { useState, useEffect } from "react";
import AuctionCard from "@/components/auction-card";
import Loading from "@/components/loading";

// Mock data - will be replaced with API data
const mockAuctions = [
  {
    id: "1",
    title: "1912 Titanic Commemorative Medal",
    description:
      "Rare bronze medal in excellent condition, issued shortly after the disaster to honor victims and survivors. Features detailed relief of the ship and commemorative text.",
    image:
      "https://images.unsplash.com/photo-1638913971873-bcef634bdcd9?q=80&w=1200",
    currentBid: 1250,
    currency: "USD",
    endDate: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
  },
  {
    id: "2",
    title: "Vintage Naval Sextant",
    description:
      "WWII era brass sextant with original wooden case. Used by navigators to measure angular distances between objects and the horizon for celestial navigation.",
    image:
      "https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=1200",
    currentBid: 780,
    currency: "USD",
    endDate: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
  },
  {
    id: "3",
    title: "Captain's Pocket Chronometer",
    description:
      "19th century silver-cased marine chronometer with documented provenance. Essential tool for determining longitude during sea voyages.",
    image:
      "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1200",
    currentBid: 3400,
    currency: "USD",
    endDate: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
  },
  {
    id: "4",
    title: "Antique Ship's Bell",
    description:
      "Authentic 19th century solid brass ship's bell recovered from a merchant vessel. Features beautiful patina and clear, resonant tone.",
    image:
      "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?q=80&w=1200",
    currentBid: 950,
    currency: "USD",
    endDate: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
  },
  {
    id: "5",
    title: "Maritime Telescope",
    description:
      "Hand-crafted brass telescope from the early 1900s. Three extending draws with original leather wrapping. Perfect for collectors of nautical instruments.",
    image:
      "https://images.unsplash.com/photo-1580397581045-a4ee5652a3f0?q=80&w=1200",
    currentBid: 560,
    currency: "USD",
    endDate: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
  },
  {
    id: "6",
    title: "Historical Lighthouse Blueprints",
    description:
      "Original architectural drawings of Boston Harbor Lighthouse circa 1850. Detailed ink on linen paper with hand annotations.",
    image:
      "https://images.unsplash.com/photo-1595820929697-22e106d2f26c?q=80&w=1200",
    currentBid: 1800,
    currency: "USD",
    endDate: new Date(Date.now() + 518400000).toISOString(), // 6 days from now
  },
];

// Filter types for the auction list
type FilterType = "all" | "ending-soon" | "newly-listed" | "high-value";

export default function Auctions() {
  const [auctions, setAuctions] = useState(mockAuctions);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<
    "default" | "price-high" | "price-low" | "ending-soon"
  >("default");

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);

    // In the future, replace with actual API call:
    // async function fetchAuctions() {
    //   try {
    //     const response = await fetch('api/auctions/active');
    //     const data = await response.json();
    //     setAuctions(data);
    //     setLoading(false);
    //   } catch (error) {
    //     console.error('Failed to fetch auctions:', error);
    //     setLoading(false);
    //   }
    // }
    // fetchAuctions();
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
          return ["1", "2", "3"].includes(auction.id);
        case "high-value":
          return auction.currentBid > 1000;
        case "all":
        default:
          return true;
      }
    })
    .sort((a, b) => {
      // Sorting options
      switch (sortBy) {
        case "price-high":
          return b.currentBid - a.currentBid;
        case "price-low":
          return a.currentBid - b.currentBid;
        case "ending-soon":
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        default:
          return 0; // Keep original order
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-16">
      {/* Hero section with elegant background */}
      <div className="bg-blue-900 text-white py-16 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Maritime Collectibles
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Discover authentic maritime artifacts from collectors around the
            world
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Search and filter controls in a refined card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-8 pl-4"
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

          {/* Sleek filter buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              className={`py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                activeFilter === "all"
                  ? "bg-blue-900 text-white"
                  : "bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200"
              }`}
              onClick={() => setActiveFilter("all")}
            >
              All Items
            </button>
            <button
              className={`py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                activeFilter === "ending-soon"
                  ? "bg-blue-900 text-white"
                  : "bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200"
              }`}
              onClick={() => setActiveFilter("ending-soon")}
            >
              Ending Soon
            </button>
            <button
              className={`py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                activeFilter === "newly-listed"
                  ? "bg-blue-900 text-white"
                  : "bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200"
              }`}
              onClick={() => setActiveFilter("newly-listed")}
            >
              Newly Listed
            </button>
            <button
              className={`py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                activeFilter === "high-value"
                  ? "bg-blue-900 text-white"
                  : "bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200"
              }`}
              onClick={() => setActiveFilter("high-value")}
            >
              High Value
            </button>
          </div>
        </div>

        {/* Loading state - keeping minimal animation for loading only */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loading size="large" />
            <p className="mt-4 text-gray-600">Discovering treasures...</p>
          </div>
        ) : (
          <>
            {/* Results count and description */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">
                {filteredAuctions.length}{" "}
                {filteredAuctions.length === 1 ? "collectible" : "collectibles"}{" "}
                found
              </p>
              {activeFilter !== "all" && (
                <button
                  onClick={() => setActiveFilter("all")}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <span>Clear filter</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Auction cards grid with refined spacing */}
            {filteredAuctions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAuctions.map((auction, index) => (
                  <AuctionCard
                    key={auction.id}
                    title={auction.title}
                    description={auction.description}
                    image={auction.image}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-600 text-lg mb-4">
                  No collectibles match your search criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("all");
                    setSortBy("default");
                  }}
                  className="px-6 py-2.5 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition-colors font-medium"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
