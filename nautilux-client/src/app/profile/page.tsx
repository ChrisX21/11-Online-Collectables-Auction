"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import Image from "next/image";
import Link from "next/link";
import {
  FaUser,
  FaHistory,
  FaCog,
  FaBox,
  FaHeart,
  FaTimes,
} from "react-icons/fa";
import { format } from "date-fns";
import api from "@/utils/axios";
import { toast } from "react-hot-toast";

interface Bid {
  listingId: number;
  bidId: number;
  userId: string;
  amount: number;
  timestamp: string;
}

interface BidWithListing extends Bid {
  listing?: {
    title: string;
    status: number;
    stringStatus: string;
    currentBid?: {
      userId: string;
    };
  };
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

interface AuctionItem {
  listingId: number;
  id?: number;
  title: string;
  description: string;
  startingPrice: number;
  image?: ListingImage;
  images: ListingImage[];
  currentBid: Bid | null;
  endDate: string;
  status: number;
  sellerId: string;
  stringStatus: string;
  categoryId?: number;
}

export default function Profile() {
  const { isAuthenticated, user, isLoading, updateProfile } = useAuth();
  const { favorites: favoriteIds, removeFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [myAuctions, setMyAuctions] = useState<AuctionItem[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [myBidListings, setMyBidListings] = useState<{
    [key: number]: AuctionItem;
  }>({});
  const [wonAuctions, setWonAuctions] = useState<AuctionItem[]>([]);
  const [favorites, setFavorites] = useState<AuctionItem[]>([]);
  const [auctionsLoading, setAuctionsLoading] = useState(false);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [wonAuctionsLoading, setWonAuctionsLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [activeBidsCount, setActiveBidsCount] = useState(0);
  const [wonAuctionsCount, setWonAuctionsCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    if (user) {
      setUserForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchBids();
      fetchWonAuctions();
      fetchFavorites();
    }
  }, [user, isAuthenticated, favoriteIds]);

  useEffect(() => {
    if (activeTab === "auctions" && isAuthenticated) {
      fetchUserAuctions();
    } else if (activeTab === "bids" && isAuthenticated) {
      fetchBids();
    } else if (activeTab === "won" && isAuthenticated) {
      fetchWonAuctions();
    } else if (activeTab === "favorites" && isAuthenticated) {
      fetchFavorites();
    }
  }, [activeTab, isAuthenticated, favoriteIds]);

  const fetchUserAuctions = async () => {
    setAuctionsLoading(true);
    try {
      const response = await api.get("/listings/user");
      setMyAuctions(response.data);
    } catch (error) {
      console.error("Failed to fetch user auctions:", error);
    } finally {
      setAuctionsLoading(false);
    }
  };

  const fetchBids = async () => {
    setBidsLoading(true);
    try {
      const bidsResponse = await api.get("/bids");
      const bids = bidsResponse.data as Bid[];
      setMyBids(bids);

      let activeCount = 0;

      if (bids && bids.length > 0) {
        const listingIds = [...new Set(bids.map((bid: Bid) => bid.listingId))];
        const listingsData: { [key: number]: AuctionItem } = {};

        for (const listingId of listingIds) {
          try {
            const listingResponse = await api.get(`/listings/${listingId}`);
            const listing = listingResponse.data;
            listingsData[listingId] = listing;
          } catch (error) {
            console.error(`Failed to fetch listing ${listingId}:`, error);
          }
        }

        setMyBidListings(listingsData);

        const activeBids = bids.filter((bid) => {
          const listing = listingsData[bid.listingId];
          return listing && listing.status === 1;
        });

        activeCount = activeBids.length;
      }

      setActiveBidsCount(activeCount);
    } catch (error) {
      console.error("Failed to fetch user bids:", error);
    } finally {
      setBidsLoading(false);
    }
  };

  const fetchWonAuctions = async () => {
    if (!user) return;

    setWonAuctionsLoading(true);
    try {
      const bidsResponse = await api.get("/bids");
      const userBids = bidsResponse.data as Bid[];

      if (!userBids || userBids.length === 0) {
        setWonAuctions([]);
        setWonAuctionsCount(0);
        return;
      }

      const listingIds = [
        ...new Set(userBids.map((bid: Bid) => bid.listingId)),
      ];

      const fetchedListings: AuctionItem[] = [];
      const userWonAuctions: AuctionItem[] = [];

      for (const listingId of listingIds) {
        try {
          const listingResponse = await api.get(`/listings/${listingId}`);
          const listing = listingResponse.data;
          fetchedListings.push(listing);

          if (
            listing.status === 2 && // Completed status
            listing.currentBid &&
            listing.currentBid.userId === user.id
          ) {
            userWonAuctions.push(listing);
          }
        } catch (error) {
          console.error(`Failed to fetch listing ${listingId}:`, error);
        }
      }

      setWonAuctions(userWonAuctions);
      setWonAuctionsCount(userWonAuctions.length);
    } catch (error) {
      console.error("Failed to fetch won auctions:", error);
    } finally {
      setWonAuctionsLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!favoriteIds.length) {
      setFavorites([]);
      setFavoritesCount(0);
      return;
    }

    setFavoritesLoading(true);
    try {
      // Get all active listings
      const response = await api.get("/listings/active");

      // Filter to only include favorited items
      const filteredAuctions = response.data.filter((auction: AuctionItem) =>
        favoriteIds.includes(Number(auction.id || auction.listingId))
      );

      setFavorites(filteredAuctions);
      setFavoritesCount(filteredAuctions.length);
    } catch (error) {
      console.error("Failed to fetch favorite auctions:", error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const handleRemoveFavorite = (listingId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(listingId);
  };

  const getStatusStyle = (status: number) => {
    switch (status) {
      case 0: // Draft
        return "bg-gray-100 text-gray-800";
      case 1: // Active
        return "bg-green-100 text-green-800";
      case 2: // Completed
        return "bg-blue-100 text-blue-800";
      case 3: // Expired
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="pt-24 min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-light mb-6">Sign In Required</h1>
          <p className="text-gray-600 mb-8">
            Please sign in to view your profile.
          </p>
          <Link
            href="/auth/sign-in"
            className="px-6 py-3 bg-blue-900 text-white hover:bg-blue-800 transition-colors rounded-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <main className="pt-24 min-h-screen bg-neutral-50">
      <div className="bg-blue-900 py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-blue-900 text-3xl font-medium shadow-md">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-light text-white mb-2">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-blue-100 mb-1">
                Member since:{" "}
                {user?.createdAt
                  ? format(user.createdAt, "dd MMMM yyyy")
                  : "N/A"}
              </p>
              <p className="text-blue-100 mb-4">Role: {user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="mb-8 border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === "profile"
                  ? "border-b-2 border-blue-900 text-blue-900"
                  : "text-gray-600 hover:text-blue-900"
              }`}
            >
              <FaUser className="mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("bids")}
              className={`flex items-center px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === "bids"
                  ? "border-b-2 border-blue-900 text-blue-900"
                  : "text-gray-600 hover:text-blue-900"
              }`}
            >
              <FaHistory className="mr-2" />
              My Bids
            </button>
            <button
              onClick={() => setActiveTab("won")}
              className={`flex items-center px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === "won"
                  ? "border-b-2 border-blue-900 text-blue-900"
                  : "text-gray-600 hover:text-blue-900"
              }`}
            >
              <FaBox className="mr-2" />
              Won Auctions
            </button>
            <button
              onClick={() => setActiveTab("auctions")}
              className={`flex items-center px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === "auctions"
                  ? "border-b-2 border-blue-900 text-blue-900"
                  : "text-gray-600 hover:text-blue-900"
              }`}
            >
              <FaBox className="mr-2" />
              My Auctions
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex items-center px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === "favorites"
                  ? "border-b-2 border-blue-900 text-blue-900"
                  : "text-gray-600 hover:text-blue-900"
              }`}
            >
              <FaHeart className="mr-2" />
              Favorites
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-light">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-900 hover:text-blue-700 text-sm font-medium"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              {isEditing ? (
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await updateProfile(userForm);
                      setIsEditing(false);
                      toast.success("Profile updated successfully!");
                    } catch (error) {
                      console.error("Failed to update profile:", error);
                      toast.error(
                        "Failed to update profile. Please try again."
                      );
                    }
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={userForm.firstName}
                        onChange={(e) =>
                          setUserForm({
                            ...userForm,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={userForm.lastName}
                        onChange={(e) =>
                          setUserForm({ ...userForm, lastName: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) =>
                        setUserForm({ ...userForm, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        if (user) {
                          setUserForm({
                            firstName: user.firstName || "",
                            lastName: user.lastName || "",
                            email: user.email || "",
                          });
                        }
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm text-gray-500 mb-1">First Name</h3>
                      <p className="font-medium">{user?.firstName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-gray-500 mb-1">Last Name</h3>
                      <p className="font-medium">{user?.lastName}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">Email</h3>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
              )}

              <div className="pt-6 mt-6 border-t border-gray-200">
                <h2 className="text-2xl font-light mb-4">Account Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Active Bids</p>
                    <p className="text-2xl font-light">{activeBidsCount}</p>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Won Auctions</p>
                    <p className="text-2xl font-light">{wonAuctionsCount}</p>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Saved Items</p>
                    <p className="text-2xl font-light">{favoritesCount}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Bids Tab */}
          {activeTab === "bids" && (
            <div>
              <h2 className="text-2xl font-light mb-6">My Bids</h2>

              {bidsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : myBids.length > 0 ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="max-h-[500px] overflow-y-auto">
                    {myBids.map((bid) => (
                      <div
                        key={bid.bidId}
                        className="border-b last:border-b-0 border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="p-3">
                          <div className="flex flex-row justify-between items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/auctions/${bid.listingId}`}
                                className="hover:text-blue-900 transition-colors"
                              >
                                <h3 className="font-medium text-sm truncate">
                                  {myBidListings[bid.listingId]?.title ||
                                    `Auction #${bid.listingId}`}
                                </h3>
                              </Link>
                              <p className="text-xs text-gray-500">
                                {new Date(bid.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {formatPrice(bid.amount)}
                              </p>
                              {myBidListings[bid.listingId] && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${getStatusStyle(
                                    myBidListings[bid.listingId].status
                                  )}`}
                                >
                                  {myBidListings[bid.listingId].stringStatus}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-neutral-50 rounded-lg">
                  <h3 className="text-gray-500 mb-4">No Bids Yet</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't placed any bids yet. Start bidding on auctions
                    to see them here.
                  </p>
                  <Link
                    href="/auctions"
                    className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
                  >
                    Explore Auctions
                  </Link>
                </div>
              )}
            </div>
          )}
          {/* Won Auctions Tab */}
          {activeTab === "won" && (
            <div>
              <h2 className="text-2xl font-light mb-6">Won Auctions</h2>

              {wonAuctionsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : wonAuctions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wonAuctions.map((auction) => (
                    <div
                      key={auction.listingId}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <Link href={`/auctions/${auction.listingId}`}>
                        <div className="relative h-48">
                          {auction.images && auction.images.length > 0 ? (
                            <Image
                              src={auction.images[0].url}
                              alt={auction.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400">No Image</span>
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Link href={`/auctions/${auction.listingId}`}>
                            <h3 className="font-medium line-clamp-1">
                              {auction.title}
                            </h3>
                          </Link>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(
                              auction.status
                            )}`}
                          >
                            {auction.stringStatus}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {auction.description}
                        </p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">
                            {auction.currentBid
                              ? formatPrice(auction.currentBid.amount)
                              : formatPrice(auction.startingPrice)}
                          </span>
                          <span className="text-gray-500">
                            Ended:{" "}
                            {new Date(auction.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-neutral-50 rounded-lg">
                  <h3 className="text-gray-500 mb-4">No Won Auctions</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't won any auctions yet. Keep bidding to win
                    collectibles!
                  </p>
                  <Link
                    href="/auctions"
                    className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
                  >
                    Explore Auctions
                  </Link>
                </div>
              )}
            </div>
          )}
          {/* Auctions Tab */}
          {activeTab === "auctions" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light">My Auctions</h2>
                <Link
                  href="/create-auction"
                  className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors text-sm"
                >
                  Create New Auction
                </Link>
              </div>

              {auctionsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : myAuctions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myAuctions.map((auction) => (
                    <div
                      key={auction.listingId || auction.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <Link
                        href={`/auctions/${auction.listingId || auction.id}`}
                      >
                        <div className="relative h-48">
                          {auction.image ? (
                            <Image
                              src={auction.image.url}
                              alt={auction.title}
                              fill
                              className="object-cover"
                            />
                          ) : auction.images && auction.images.length > 0 ? (
                            <Image
                              src={auction.images[0].url}
                              alt={auction.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400">No Image</span>
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Link
                            href={`/auctions/${
                              auction.listingId || auction.id
                            }`}
                          >
                            <h3 className="font-medium line-clamp-1">
                              {auction.title}
                            </h3>
                          </Link>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(
                              auction.status
                            )}`}
                          >
                            {auction.stringStatus}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {auction.description}
                        </p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">
                            {auction.currentBid
                              ? formatPrice(auction.currentBid.amount)
                              : formatPrice(auction.startingPrice)}
                          </span>
                          <span className="text-gray-500">
                            Ends:{" "}
                            {new Date(auction.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Link
                            href={`/edit-auction/${
                              auction.listingId || auction.id
                            }`}
                            className="px-3 py-1.5 bg-blue-900 text-white text-xs rounded hover:bg-blue-800 transition-colors"
                          >
                            Edit Auction
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-neutral-50 rounded-lg">
                  <h3 className="text-gray-500 mb-4">No Auctions Yet</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't created any auctions yet. Start selling your
                    collectibles today.
                  </p>
                  <Link
                    href="/create-auction"
                    className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
                  >
                    Create Auction
                  </Link>
                </div>
              )}
            </div>
          )}
          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <div>
              <h2 className="text-2xl font-light mb-6">Your Favorites</h2>
              {favoritesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((auction) => (
                    <div
                      key={auction.id || auction.listingId}
                      className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
                    >
                      <div className="relative">
                        <Link
                          href={`/auctions/${auction.id || auction.listingId}`}
                        >
                          <div className="relative h-48 overflow-hidden">
                            {auction.image ? (
                              <Image
                                src={auction.image.url}
                                alt={auction.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : auction.images && auction.images.length > 0 ? (
                              <Image
                                src={auction.images[0].url}
                                alt={auction.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                              </div>
                            )}
                          </div>
                        </Link>
                        <button
                          onClick={(e) =>
                            handleRemoveFavorite(
                              Number(auction.id || auction.listingId),
                              e
                            )
                          }
                          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200 z-10"
                          aria-label="Remove from favorites"
                        >
                          <FaTimes className="text-gray-600" size={16} />
                        </button>
                        <div className="absolute top-3 left-3 bg-blue-900/90 text-white px-3 py-1 text-xs rounded-full">
                          {auction.stringStatus}
                        </div>
                      </div>
                      <div className="p-4">
                        <Link
                          href={`/auctions/${auction.id || auction.listingId}`}
                        >
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
                              {auction.currentBid
                                ? formatPrice(auction.currentBid.amount)
                                : formatPrice(auction.startingPrice)}
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
              ) : (
                <div className="text-center py-12 bg-neutral-50 rounded-lg">
                  <FaHeart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-gray-500 mb-4">No Favorites</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't saved any auctions to your favorites yet.
                  </p>
                  <Link
                    href="/auctions"
                    className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
                  >
                    Explore Auctions
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
