"use client";
import { useState, useEffect } from "react";
import AuctionCard from "@/components/auction-card";
import Loading from "@/components/loading";

// Mock data - will be replaced with API data
const mockAllAuctions = [
  // Active Auctions
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
    status: "active",
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
    status: "active",
  },

  // Pending Auctions
  {
    id: "3",
    title: "Naval Officer's Pocket Watch",
    description:
      "Gold-plated pocket watch with naval insignia engraving. Belonged to a British Navy officer during the early 20th century.",
    image:
      "https://images.unsplash.com/photo-1517463700628-5103184eac47?q=80&w=1200",
    startingBid: 800,
    currency: "USD",
    startDate: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    status: "pending",
  },
  {
    id: "4",
    title: "Ancient Mariner's Compass",
    description:
      "16th century mariner's compass in brass case. Historical navigational tool with original patina and working mechanism.",
    image:
      "https://images.unsplash.com/photo-1533155929419-7bdc944ce372?q=80&w=1200",
    startingBid: 1200,
    currency: "USD",
    startDate: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
    status: "pending",
  },

  // Completed Auctions
  {
    id: "5",
    title: "Captain's Pocket Chronometer",
    description:
      "19th century silver-cased marine chronometer with documented provenance. Essential tool for determining longitude during sea voyages.",
    image:
      "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1200",
    soldAmount: 3400,
    currency: "USD",
    endDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    status: "completed",
  },
  {
    id: "6",
    title: "Antique Ship's Bell",
    description:
      "Authentic 19th century solid brass ship's bell recovered from a merchant vessel. Features beautiful patina and clear, resonant tone.",
    image:
      "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?q=80&w=1200",
    soldAmount: 950,
    currency: "USD",
    endDate: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    status: "completed",
  },

  // Cancelled Auctions
  {
    id: "7",
    title: "18th Century Naval Battle Map",
    description:
      "Original hand-drawn map depicting a famous naval battle. Contains strategic notations and ship positions.",
    image:
      "https://images.unsplash.com/photo-1524704738939-8e25d4f703de?q=80&w=1200",
    estimatedValue: 2500,
    currency: "USD",
    cancelDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: "cancelled",
  },

  // More active auctions
  {
    id: "8",
    title: "Maritime Telescope",
    description:
      "Hand-crafted brass telescope from the early 1900s. Three extending draws with original leather wrapping. Perfect for collectors of nautical instruments.",
    image:
      "https://images.unsplash.com/photo-1580397581045-a4ee5652a3f0?q=80&w=1200",
    currentBid: 560,
    currency: "USD",
    endDate: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
    status: "active",
  },
  {
    id: "9",
    title: "Historical Lighthouse Blueprints",
    description:
      "Original architectural drawings of Boston Harbor Lighthouse circa 1850. Detailed ink on linen paper with hand annotations.",
    image:
      "https://images.unsplash.com/photo-1595820929697-22e106d2f26c?q=80&w=1200",
    currentBid: 1800,
    currency: "USD",
    endDate: new Date(Date.now() + 518400000).toISOString(), // 6 days from now
    status: "active",
  },

  // More completed auctions
  {
    id: "10",
    title: "Ship Captain's Logbook",
    description:
      "Authentic 19th century captain's logbook with detailed entries from a transatlantic voyage. Contains weather observations, course calculations, and crew notes.",
    image:
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=1200",
    soldAmount: 1650,
    currency: "USD",
    endDate: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    status: "completed",
  },
  {
    id: "11",
    title: "Navy Admiral's Ceremonial Sword",
    description:
      "Gold-plated ceremonial sword awarded to a distinguished admiral. Features ornate handle and etched blade with maritime motifs.",
    image:
      "https://images.unsplash.com/photo-1583245122337-efbe6b03276a?q=80&w=1200",
    soldAmount: 4200,
    currency: "USD",
    endDate: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
    status: "completed",
  },

  // Draft auctions
  {
    id: "12",
    title: "Ancient Diving Helmet",
    description:
      "Copper and brass diving helmet from the early 20th century. Used for deep-sea salvage operations. Includes original air hoses and fittings.",
    image:
      "https://images.unsplash.com/photo-1551649553-d1b6faa662f6?q=80&w=1200",
    estimatedValue: 3800,
    currency: "USD",
    draftDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: "draft",
  },
];

// Status filter types
type StatusFilterType =
  | "all"
  | "active"
  | "pending"
  | "completed"
  | "cancelled"
  | "draft";

// Category filter types
type CategoryFilterType =
  | "all"
  | "medals"
  | "instruments"
  | "documents"
  | "artifacts";

export default function Catalog() {
  const [auctions, setAuctions] = useState(mockAllAuctions);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");
  const [sortBy, setSortBy] = useState<
    "default" | "price-high" | "price-low" | "recent" | "oldest"
  >("default");

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);

    // In the future, replace with actual API call:
    // async function fetchAllAuctions() {
    //   try {
    //     const response = await fetch('api/auctions/all');
    //     const data = await response.json();
    //     setAuctions(data);
    //     setLoading(false);
    //   } catch (error) {
    //     console.error('Failed to fetch auctions:', error);
    //     setLoading(false);
    //   }
    // }
    // fetchAllAuctions();
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
      // Status filters
      switch (statusFilter) {
        case "active":
          return auction.status === "active";
        case "pending":
          return auction.status === "pending";
        case "completed":
          return auction.status === "completed";
        case "cancelled":
          return auction.status === "cancelled";
        case "draft":
          return auction.status === "draft";
        case "all":
        default:
          return true;
      }
    })
    .sort((a, b) => {
      // Sorting options
      switch (sortBy) {
        case "price-high":
          const aPrice =
            a.currentBid ||
            a.soldAmount ||
            a.startingBid ||
            a.estimatedValue ||
            0;
          const bPrice =
            b.currentBid ||
            b.soldAmount ||
            b.startingBid ||
            b.estimatedValue ||
            0;
          return bPrice - aPrice;
        case "price-low":
          const aPrice2 =
            a.currentBid ||
            a.soldAmount ||
            a.startingBid ||
            a.estimatedValue ||
            0;
          const bPrice2 =
            b.currentBid ||
            b.soldAmount ||
            b.startingBid ||
            b.estimatedValue ||
            0;
          return aPrice2 - bPrice2;
        case "recent":
          const aDate = new Date(
            a.endDate || a.startDate || a.cancelDate || a.draftDate || 0
          );
          const bDate = new Date(
            b.endDate || b.startDate || b.cancelDate || b.draftDate || 0
          );
          return bDate.getTime() - aDate.getTime(); // newest first
        case "oldest":
          const aDate2 = new Date(
            a.endDate || a.startDate || a.cancelDate || a.draftDate || 0
          );
          const bDate2 = new Date(
            b.endDate || b.startDate || b.cancelDate || b.draftDate || 0
          );
          return aDate2.getTime() - bDate2.getTime(); // oldest first
        default:
          return 0; // Keep original order
      }
    });

  // Get count by status for the status summary
  const statusCounts = {
    all: auctions.length,
    active: auctions.filter((a) => a.status === "active").length,
    pending: auctions.filter((a) => a.status === "pending").length,
    completed: auctions.filter((a) => a.status === "completed").length,
    cancelled: auctions.filter((a) => a.status === "cancelled").length,
    draft: auctions.filter((a) => a.status === "draft").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-16">
      {/* Hero section with elegant background */}
      <div className="bg-blue-900 text-white py-16 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Complete Auction Catalog
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Browse our entire collection of maritime collectibles including
            active, pending, and past auctions
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Status summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-3 rounded-lg flex flex-col items-center justify-center transition-colors ${
              statusFilter === "all"
                ? "bg-blue-900 text-white"
                : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <span className="text-2xl font-bold">{statusCounts.all}</span>
            <span className="text-sm">All Auctions</span>
          </button>

          <button
            onClick={() => setStatusFilter("active")}
            className={`px-4 py-3 rounded-lg flex flex-col items-center justify-center transition-colors ${
              statusFilter === "active"
                ? "bg-green-700 text-white"
                : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <span className="text-2xl font-bold">{statusCounts.active}</span>
            <span className="text-sm">Active</span>
          </button>

          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-4 py-3 rounded-lg flex flex-col items-center justify-center transition-colors ${
              statusFilter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <span className="text-2xl font-bold">{statusCounts.pending}</span>
            <span className="text-sm">Pending</span>
          </button>

          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-4 py-3 rounded-lg flex flex-col items-center justify-center transition-colors ${
              statusFilter === "completed"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <span className="text-2xl font-bold">{statusCounts.completed}</span>
            <span className="text-sm">Completed</span>
          </button>

          <button
            onClick={() => setStatusFilter("cancelled")}
            className={`px-4 py-3 rounded-lg flex flex-col items-center justify-center transition-colors ${
              statusFilter === "cancelled"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <span className="text-2xl font-bold">{statusCounts.cancelled}</span>
            <span className="text-sm">Cancelled</span>
          </button>

          <button
            onClick={() => setStatusFilter("draft")}
            className={`px-4 py-3 rounded-lg flex flex-col items-center justify-center transition-colors ${
              statusFilter === "draft"
                ? "bg-gray-700 text-white"
                : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <span className="text-2xl font-bold">{statusCounts.draft}</span>
            <span className="text-sm">Draft</span>
          </button>
        </div>

        {/* Search and filter controls in a refined card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search the entire catalog..."
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
                <option value="default">Sort By: Featured</option>
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading state - keeping minimal animation for loading only */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loading size="large" />
            <p className="mt-4 text-gray-600">Loading catalog...</p>
          </div>
        ) : (
          <>
            {/* Results count and description */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-600">
                  {filteredAuctions.length}{" "}
                  {filteredAuctions.length === 1
                    ? "collectible"
                    : "collectibles"}{" "}
                  found
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {statusFilter !== "all" &&
                    `Showing ${statusFilter} auctions only`}
                </p>
              </div>
              {statusFilter !== "all" && (
                <button
                  onClick={() => setStatusFilter("all")}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <span>Show all auctions</span>
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
                  <div key={auction.id} className="relative">
                    {/* Status badge */}
                    {auction.status !== "active" && (
                      <div
                        className={`absolute top-4 left-4 z-10 py-1 px-3 rounded-md text-xs font-bold uppercase ${
                          auction.status === "completed"
                            ? "bg-blue-600 text-white"
                            : auction.status === "pending"
                            ? "bg-yellow-500 text-white"
                            : auction.status === "cancelled"
                            ? "bg-red-500 text-white"
                            : "bg-gray-600 text-white"
                        }`}
                      >
                        {auction.status}
                      </div>
                    )}
                    <AuctionCard
                      key={auction.id}
                      title={auction.title}
                      description={auction.description}
                      image={auction.image}
                      index={index}
                    />
                  </div>
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
                    setStatusFilter("all");
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
