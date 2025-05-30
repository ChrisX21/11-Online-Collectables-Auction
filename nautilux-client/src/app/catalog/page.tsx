"use client";
import { useState, useEffect } from "react";
import Loading from "@/components/loading";
import AuctionCard, { AuctionItem } from "@/components/AuctionCard";
import Link from "next/link";
import api from "@/utils/axios";
import { useAuth } from "@/context/AuthContext";

// Filter types for the catalog list
type FilterType = "all" | "active" | "sold" | "high-value";

export default function Catalog() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "Admin";
  const [listings, setListings] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<
    "default" | "price-high" | "price-low" | "newest"
  >("default");

  // Category filtering
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Create a new category (admin only)
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !newCategoryName.trim()) return;

    setAddingCategory(true);
    try {
      const response = await api.post("/categories", {
        name: newCategoryName.trim(),
      });
      setCategories([...categories, response.data]);
      setNewCategoryName("");
      setShowCategoryModal(false);
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setAddingCategory(false);
    }
  };

  useEffect(() => {
    async function fetchAllListings() {
      try {
        const response = await api.get("/listings/");
        // Filter out draft auctions for non-sellers/non-admins
        const filteredListings = response.data.filter(
          (listing: AuctionItem) => {
            // Always show non-draft auctions
            if (listing.stringStatus !== "Draft") {
              return true;
            }

            // If it's a draft, only show to admin or to the seller
            if (isAdmin) {
              return true;
            }

            // If user is authenticated, check if they're the seller
            if (isAuthenticated && user && listing.sellerId === user.id) {
              return true;
            }

            // Otherwise, don't show draft auctions
            return false;
          }
        );

        setListings(filteredListings);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch catalog listings:", error);
        setLoading(false);
      }
    }
    fetchAllListings();
  }, [isAuthenticated, user, isAdmin]);

  // Filter listings based on search and filter criteria
  const filteredListings = listings
    .filter((listing) => {
      // Search filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          listing.title.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((listing) => {
      // Category filter
      if (selectedCategoryId !== null) {
        return listing.categoryId === selectedCategoryId;
      }
      return true;
    })
    .filter((listing) => {
      // Status filters
      switch (activeFilter) {
        case "active":
          return listing.status === 1; // Active status
        case "sold":
          return listing.status === 2;
        case "high-value":
          return listing.currentBid
            ? listing.currentBid.amount > 1000
            : listing.startingPrice > 1000;
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
        case "newest":
          return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
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
              Complete
              <span className="font-serif italic block mt-2">Catalog</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 font-light">
              Browse our complete collection of maritime artifacts and treasures
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-md">
                <div className="text-3xl font-light">{listings.length}</div>
                <div className="text-sm text-gray-300">Total Items</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-md">
                <div className="text-3xl font-light">
                  {listings.filter((item) => item.status === 1).length}
                </div>
                <div className="text-sm text-gray-300">Active Listings</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-md">
                <div className="text-3xl font-light">100%</div>
                <div className="text-sm text-gray-300">Satisfaction</div>
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
                value={selectedCategoryId || ""}
                onChange={(e) =>
                  setSelectedCategoryId(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1rem",
                }}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
                <option value="default">Default</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowCategoryModal(true)}
                className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Category
              </button>
            )}
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
                activeFilter === "active"
                  ? "bg-black text-white"
                  : "bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200"
              }`}
              onClick={() => setActiveFilter("active")}
            >
              Active Listings
            </button>
            <button
              className={`py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                activeFilter === "sold"
                  ? "bg-black text-white"
                  : "bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200"
              }`}
              onClick={() => setActiveFilter("sold")}
            >
              Sold Items
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

        {/* Catalog Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loading />
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-light mb-4">No items found</h3>
            <p className="text-gray-500 mb-8">
              Try adjusting your search or filter settings
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
                setSortBy("default");
                setSelectedCategoryId(null);
              }}
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-6">
              Showing {filteredListings.length} of {listings.length} items
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map((listing) => (
                <AuctionCard key={listing.id} item={listing} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Category Modal for admins */}
      {showCategoryModal && isAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-medium mb-4">Add New Category</h2>
            <form onSubmit={handleCreateCategory}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingCategory || !newCategoryName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                  {addingCategory ? "Adding..." : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
