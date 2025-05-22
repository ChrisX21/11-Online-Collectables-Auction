import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/context/AuthContext";

interface Bid {
  listingId: number;
  bidId: number;
  userId: string;
  amount: number;
  timestamp: string;
}

interface ListingImage {
  id: number;
  listingId: number;
  url: string;
  isPrimary: boolean;
  caption: string | null;
  displayOrder: number;
  listing: any | null;
}

export interface AuctionItem {
  id: number;
  title: string;
  description: string;
  startingPrice: number;
  image: ListingImage;
  currentBid: Bid | null;
  endDate: string;
  status: number;
  sellerId: string;
  stringStatus: string;
  categoryId?: number;
}

interface AuctionCardProps {
  item: AuctionItem;
  featured?: boolean;
}

export default function AuctionCard({
  item,
  featured = false,
}: AuctionCardProps) {
  const timeRemaining = formatDistanceToNow(new Date(item.endDate), {
    addSuffix: true,
  });
  const currentPrice = item.currentBid
    ? item.currentBid.amount
    : item.startingPrice;

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const isFavorited = isFavorite(item.id);

  // Check if auction is active (status === 1)
  const isActive = item.status === 1;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the Link from navigating

    // Only allow favoriting/unfavoriting active auctions
    if (!isActive) return;

    if (isFavorited) {
      removeFavorite(item.id);
    } else {
      addFavorite(item.id);
    }
  };

  return (
    <Link href={`/auctions/${item.id}`}>
      <div
        className={`group cursor-pointer transition-transform duration-300 hover:-translate-y-1 ${
          featured ? "hover:shadow-xl" : "hover:shadow-md"
        }`}
      >
        {/* Image Container */}
        <div className="relative h-[280px] overflow-hidden rounded-t-lg">
          <Image
            src={item.image.url}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50" />

          {/* Status Badge */}
          <div className="absolute top-4 right-4 bg-blue-900/90 text-white px-3 py-1 text-xs rounded-full">
            {item.stringStatus}
          </div>

          {/* Favorite Button (only show for authenticated users and only enable for active auctions) */}
          {isAuthenticated && (
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-4 left-4 p-2 rounded-full transition-colors duration-200 ${
                !isActive
                  ? "bg-gray-300/90 cursor-not-allowed"
                  : "bg-white/90 hover:bg-white"
              }`}
              aria-label={
                isFavorited ? "Remove from favorites" : "Add to favorites"
              }
              disabled={!isActive}
              title={!isActive ? "Only active auctions can be favorited" : ""}
            >
              {isFavorited ? (
                <FaHeart
                  className={isActive ? "text-red-500" : "text-gray-400"}
                  size={16}
                />
              ) : (
                <FaRegHeart
                  className={isActive ? "text-gray-600" : "text-gray-400"}
                  size={16}
                />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 bg-white border border-gray-100 rounded-b-lg">
          <h3 className="text-lg font-medium line-clamp-1 mb-2">
            {item.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
            {item.description}
          </p>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-xs">Current Bid</p>
              {isAuthenticated ? (
                <p className="text-lg font-medium">
                  ${currentPrice.toFixed(2)}
                </p>
              ) : (
                <p className="text-lg font-medium">
                  <span className="text-blue-900 hover:underline">
                    Sign in to view
                  </span>
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs">Ends</p>
              <p className="text-sm">{timeRemaining}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
