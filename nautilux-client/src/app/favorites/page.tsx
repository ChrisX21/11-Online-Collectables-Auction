"use client";
import { useState, useEffect } from "react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import AuctionCard, { AuctionItem } from "@/components/AuctionCard";
import Loading from "@/components/loading";
import { FaHeart, FaTimes, FaSearch } from "react-icons/fa";
import api from "@/utils/axios";
import Link from "next/link";
import Image from "next/image";

export default function FavoritesPage() {
  const {
    favorites,
    isLoading: favoritesLoading,
    removeFavorite,
  } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [favoriteAuctions, setFavoriteAuctions] = useState<AuctionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchFavoriteAuctions = async () => {
      if (!isAuthenticated || favorites.length === 0) {
        setFavoriteAuctions([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Get all active listings
        const response = await api.get("/listings/active");

        // Filter to only include favorited items that are active
        const filteredAuctions = response.data.filter(
          (auction: AuctionItem) =>
            favorites.includes(Number(auction.id)) && auction.status === 1 // Only include active auctions (status === 1)
        );

        setFavoriteAuctions(filteredAuctions);
      } catch (error) {
        console.error("Failed to fetch favorite auctions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch auctions once favorites have loaded
    if (!favoritesLoading) {
      fetchFavoriteAuctions();
    }
  }, [favorites, isAuthenticated, favoritesLoading]);

  const handleRemoveFavorite = (listingId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(listingId);
  };

  // Filter auctions based on search query
  const filteredAuctions = favoriteAuctions.filter(
    (auction) =>
      auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading || favoritesLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-sm border border-gray-100">
          <FaHeart className="text-red-400 w-16 h-16 mx-auto mb-6" />
          <h1 className="text-2xl font-semibold mb-4">
            Sign in to view favorites
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to save and view your favorite auctions.
          </p>
          <Link
            href="/auth/sign-in"
            className="bg-blue-600 text-white px-6 py-3 rounded-md inline-block hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-sm border border-gray-100">
          <FaHeart className="text-gray-300 w-16 h-16 mx-auto mb-6" />
          <h1 className="text-2xl font-semibold mb-4">No favorites yet</h1>
          <p className="text-gray-600 mb-6">
            You haven't added any auctions to your favorites. Browse our
            auctions and click the heart icon to save your favorites.
          </p>
          <Link
            href="/auctions"
            className="bg-blue-600 text-white px-6 py-3 rounded-md inline-block hover:bg-blue-700 transition-colors"
          >
            Browse Auctions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Your Favorites</h1>
          <p className="text-gray-600">
            Manage the auctions you've saved to your favorites.
          </p>
        </header>

        {/* Search and Count */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0 text-gray-600">
            <span className="font-semibold text-blue-900">
              {filteredAuctions.length}
            </span>
            {filteredAuctions.length === 1 ? " item" : " items"} in your
            favorites
          </p>

          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search favorites"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAuctions.map((auction) => (
            <div
              key={auction.id}
              className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 bg-white"
            >
              <div className="relative">
                <Link href={`/auctions/${auction.id}`}>
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={auction.image.url}
                      alt={auction.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
                  </div>
                </Link>
                <button
                  onClick={(e) => handleRemoveFavorite(Number(auction.id), e)}
                  className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-200 z-10"
                  aria-label="Remove from favorites"
                >
                  <FaTimes className="text-gray-600" size={16} />
                </button>
                <div className="absolute top-3 left-3 bg-blue-900/90 text-white px-3 py-1 text-xs rounded-full shadow-md">
                  {auction.stringStatus}
                </div>
              </div>
              <div className="p-4">
                <Link href={`/auctions/${auction.id}`}>
                  <h3 className="font-medium text-lg mb-2 line-clamp-1 hover:text-blue-900 transition-colors">
                    {auction.title}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3 h-10">
                  {auction.description}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <p className="text-gray-500 text-xs">Current Bid</p>
                    <p className="text-lg font-medium">
                      $
                      {(auction.currentBid
                        ? auction.currentBid.amount
                        : auction.startingPrice
                      ).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs">Ends</p>
                    <p className="text-sm">
                      {new Date(auction.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAuctions.length === 0 && searchQuery && (
          <div className="text-center p-12 bg-white rounded-lg shadow-sm mt-6">
            <FaSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No matching favorites found
            </h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any favorites matching "{searchQuery}".
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
