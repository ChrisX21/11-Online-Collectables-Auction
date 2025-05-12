"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaHistory, FaCog, FaBox, FaHeart } from "react-icons/fa";
import { format } from "date-fns";
import api from "@/utils/axios";

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

interface AuctionItem {
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
}

export default function Profile() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [myAuctions, setMyAuctions] = useState<AuctionItem[]>([]);
  const [myBids, setMyBids] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [auctionsLoading, setAuctionsLoading] = useState(false);

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
    if (activeTab === "auctions" && isAuthenticated) {
      fetchUserAuctions();
    }
  }, [activeTab, isAuthenticated]);

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
                Member since: {" "}
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
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === "settings"
                  ? "border-b-2 border-blue-900 text-blue-900"
                  : "text-gray-600 hover:text-blue-900"
              }`}
            >
              <FaCog className="mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Content */}
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
                <form className="space-y-4">
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
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
                  >
                    Save Changes
                  </button>
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
                    <p className="text-2xl font-light">0</p>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Won Auctions</p>
                    <p className="text-2xl font-light">0</p>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Saved Items</p>
                    <p className="text-2xl font-light">0</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bids Tab */}
          {activeTab === "bids" && (
            <div>
              <h2 className="text-2xl font-light mb-6">My Bids</h2>
              {myBids.length > 0 ? (
                <div className="space-y-4">
                  {/* Bid items would be mapped here */}
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
                      key={auction.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <Link href={`/auctions/${auction.id}`}>
                        <div className="relative h-48">
                          <Image
                            src={auction.image.url}
                            alt={auction.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Link href={`/auctions/${auction.id}`}>
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
                            href={`/edit-auction/${auction.id}`}
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
              <h2 className="text-2xl font-light mb-6">Favorites</h2>
              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Favorite items would be mapped here */}
                </div>
              ) : (
                <div className="text-center py-12 bg-neutral-50 rounded-lg">
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

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-light mb-6">Account Settings</h2>

                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium mb-1">Change Password</h3>
                        <p className="text-sm text-gray-600">
                          Update your password to keep your account secure
                        </p>
                      </div>
                      <button className="text-blue-900 hover:text-blue-700 font-medium text-sm">
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium mb-1">
                          Notification Preferences
                        </h3>
                        <p className="text-sm text-gray-600">
                          Choose when and how you want to be notified
                        </p>
                      </div>
                      <button className="text-blue-900 hover:text-blue-700 font-medium text-sm">
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium mb-1">
                          Shipping Information
                        </h3>
                        <p className="text-sm text-gray-600">
                          Manage your shipping addresses
                        </p>
                      </div>
                      <button className="text-blue-900 hover:text-blue-700 font-medium text-sm">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-light mb-6">Danger Zone</h2>
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-red-700 mb-1">
                        Delete Account
                      </h3>
                      <p className="text-sm text-red-600">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <button className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors text-sm">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
