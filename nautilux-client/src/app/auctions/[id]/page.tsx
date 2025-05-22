"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/utils/axios";
import Loading from "@/components/loading";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import useSignalR from "@/hooks/useSignalR";
import toast from "react-hot-toast";

interface Bid {
  bidId: number;
  listingId: number;
  userId: string;
  amount: number;
  timestamp: string;
  userName?: string;
}

interface Question {
  id: number;
  askerId: string;
  listingId: number;
  questionText: string;
  answerText: string | null;
  questionTimestamp: string;
  answerTimestamp: string | null;
  isPublic: boolean;
}

interface ListingImage {
  id: number;
  url: string;
  isPrimary: boolean;
  caption: string | null;
  displayOrder: number;
}

interface AuctionDetails {
  listingId: number;
  title: string;
  description: string;
  startingPrice: number;
  reservePrice: number | null;
  buyNowPrice: number | null;
  startDate: string;
  endDate: string;
  isFeatured: boolean;
  isActive: boolean;
  condition: number;
  stringCondition: string;
  origin: string;
  year: number;
  dimensions: string;
  materials: string;
  authenticityId: number | null;
  shippingOptions: number;
  stringShippingOptions: string;
  categoryId: number;
  sellerId: string;
  status: number;
  stringStatus: string;
  images: ListingImage[];
  bids?: Bid[];
  questions?: Question[];
}

export default function AuctionDetails() {
  const { id } = useParams();
  const numericId = Number(id);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [auction, setAuction] = useState<AuctionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [bidSuccess, setBidSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [recentBids, setRecentBids] = useState<Bid[]>([]);
  const [isBidding, setIsBidding] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [isAnsweringQuestion, setIsAnsweringQuestion] = useState<number | null>(
    null
  );
  const [answerTexts, setAnswerTexts] = useState<Record<number, string>>({});

  // Use SignalR Hook
  const {
    isConnected,
    placeBid,
    getCurrentBid,
    bidError: signalRBidError,
  } = useSignalR({
    listingId: numericId,
    onNewBid: (newBid) => {
      setRecentBids((prev) => {
        const updated = [newBid, ...prev.slice(0, 4)];
        return updated;
      });

      setCurrentBid(newBid);

      const minIncrement = Math.max(newBid.amount * 0.1, 5);
      setBidAmount((newBid.amount + minIncrement).toFixed(2));

      if (isAuthenticated && user && newBid.userId !== user.id) {
        toast(`New bid: $${newBid.amount.toFixed(2)}`, { duration: 3000 });
      }
    },
    onBidRejected: (reason) => {
      toast.error(reason, { duration: 3000 });
    },
    onCurrentBid: (bid) => {
      if (bid) {
        setCurrentBid(bid);
        const minIncrement = Math.max(bid.amount * 0.1, 5);
        setBidAmount((bid.amount + minIncrement).toFixed(2));
      }
    },
  });

  const [currentBid, setCurrentBid] = useState<Bid | null>(null);

  const fetchAuctionDetails = useCallback(async () => {
    if (!id) return;

    try {
      const response = await api.get(`/listings/${id}`);
      const auctionData = response.data;
      setAuction(auctionData);

      if (auctionData.bids && auctionData.bids.length > 0) {
        const sortedBids = [...auctionData.bids]
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          .slice(0, 5);
        setRecentBids(sortedBids);

        const latestBid = sortedBids[0];
        if (latestBid) {
          setCurrentBid(latestBid);
          const minIncrement = Math.max(latestBid.amount * 0.1, 5);
          setBidAmount((latestBid.amount + minIncrement).toFixed(2));
        }
      } else {
        setBidAmount(auctionData.startingPrice.toFixed(2));
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch auction details:", error);
      setError("Failed to load auction details. Please try again later.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchAuctionDetails();
    }
  }, [id, fetchAuctionDetails]);

  useEffect(() => {
    if (numericId && isConnected) {
      const timer = setTimeout(() => {
        getCurrentBid();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [numericId, getCurrentBid, isConnected]);

  const fetchQuestions = useCallback(async () => {
    if (!id) return;

    try {
      const response = await api.get(`/questions/listing/${id}`);
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchQuestions();
    }
  }, [id, fetchQuestions]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push(`/auth/sign-in?redirect=/auctions/${id}`);
      return;
    }

    const bidValue = parseFloat(bidAmount);
    if (isNaN(bidValue) || bidValue <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    if (currentBid && bidValue <= currentBid.amount) {
      toast.error("Your bid must be higher than the current bid");
      return;
    }

    if (!currentBid && bidValue < auction!.startingPrice) {
      toast.error("Your bid must be at least the starting price");
      return;
    }

    setIsBidding(true);
    try {
      const success = await placeBid(bidValue);
      if (success) {
        setBidSuccess(true);
        toast.success("Your bid was placed successfully!");
        setTimeout(() => setBidSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to place bid:", error);
      toast.error("Failed to place your bid. Please try again.");
    } finally {
      setIsBidding(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push(`/auth/sign-in?redirect=/auctions/${id}`);
      return;
    }

    if (!newQuestion.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setIsAskingQuestion(true);
    try {
      const questionData = {
        listingId: numericId,
        questionText: newQuestion,
        answerText: null,
        isPublic: true,
      };

      await api.post("/questions", questionData);
      toast.success("Your question has been submitted");
      setNewQuestion("");
      fetchQuestions();
    } catch (error) {
      console.error("Failed to submit question:", error);
      toast.error("Failed to submit your question. Please try again.");
    } finally {
      setIsAskingQuestion(false);
    }
  };

  const handleAnswerQuestion = async (questionId: number) => {
    if (!isAuthenticated || !isUserSeller) {
      return;
    }

    if (!answerTexts[questionId] || !answerTexts[questionId].trim()) {
      toast.error("Please enter an answer");
      return;
    }

    setIsAnsweringQuestion(questionId);
    try {
      await api.put(`/questions`, {
        answerText: answerTexts[questionId],
        listingId: numericId,
        id: questionId,
        questionText: questions.find((q) => q.id === questionId)?.questionText,
        askerId: questions.find((q) => q.id === questionId)?.askerId,
        isPublic: true,
      });

      toast.success("Your answer has been submitted");
      setAnswerTexts({ ...answerTexts, [questionId]: "" });
      setIsAnsweringQuestion(null);
      fetchQuestions();
    } catch (error) {
      console.error("Failed to submit answer:", error);
      toast.error("Failed to submit your answer. Please try again.");
    } finally {
      setIsAnsweringQuestion(null);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!isAuthenticated) return;

    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await api.delete(`/questions/${questionId}`);
        toast.success("Question deleted successfully");
        fetchQuestions();
      } catch (error) {
        console.error("Failed to delete question:", error);
        toast.error("Failed to delete question. Please try again.");
      }
    }
  };

  const timeRemaining = auction
    ? formatDistanceToNow(new Date(auction.endDate), { addSuffix: true })
    : "";
  const isAuctionEnded = auction
    ? new Date(auction.endDate) < new Date()
    : false;
  const isUserSeller = isAuthenticated && auction?.sellerId === user?.id;

  // Add effect to update auction status if it's ended but not marked as completed
  useEffect(() => {
    if (auction && isAuctionEnded && auction.stringStatus !== "Completed") {
      api
        .put(`/listings/${auction.listingId}`, {
          ...auction,
          stringStatus: "Completed",
          listingId: auction.listingId,
        })
        .then(() => {
          fetchAuctionDetails();
        })
        .catch((error) => {
          console.error("Failed to update auction status:", error);
        });
    }
  }, [auction, isAuctionEnded, fetchAuctionDetails]);

  const isAdmin = user?.role === "Admin";

  const handleDeleteAuction = async () => {
    if (!isAdmin || !auction) return;

    if (
      window.confirm(
        "Are you sure you want to delete this auction? This action cannot be undone."
      )
    ) {
      try {
        await api.delete(`/listings/${auction.listingId}`);
        toast.success("Auction deleted successfully");
        router.push("/auctions");
      } catch (error) {
        console.error("Failed to delete auction:", error);
        toast.error("Failed to delete auction");
      }
    }
  };

  const handleActivateAuction = async () => {
    if (!auction || (!isUserSeller && !isAdmin)) return;

    try {
      // Create a copy of the auction with updated status
      const updatedAuction = {
        ...auction,
        stringStatus: "Active",
        isActive: true,
        // API requires the listingId to be included
        listingId: auction.listingId,
      };

      await api.put(`/listings/${auction.listingId}`, updatedAuction);
      toast.success("Auction successfully activated");

      // Refresh the auction data
      fetchAuctionDetails();
    } catch (error) {
      console.error("Failed to activate auction:", error);
      toast.error("Failed to activate auction. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Check if the auction is a draft and the user is not the seller or admin
  if (
    auction &&
    auction.stringStatus === "Draft" &&
    !isUserSeller &&
    !isAdmin
  ) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-3xl font-light mb-4">Auction Not Available</h1>
        <p className="text-gray-600 mb-8">
          This auction is currently in draft mode and not publicly available.
        </p>
        <Link
          href="/auctions"
          className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors rounded"
        >
          Browse Other Auctions
        </Link>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-3xl font-light mb-4">Auction Not Found</h1>
        <p className="text-gray-600 mb-8">
          {error || "This auction doesn't exist or has been removed."}
        </p>
        <Link
          href="/auctions"
          className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors rounded"
        >
          Browse Other Auctions
        </Link>
      </div>
    );
  }

  const primaryImage =
    auction.images.find((img) => img.isPrimary) || auction.images[0];
  const currentImage = auction.images[selectedImage] || primaryImage;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 mt-16">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/auctions"
              className="hover:text-black transition-colors"
            >
              Auctions
            </Link>
            <span className="mx-2">/</span>
            <span className="text-black">{auction.title}</span>
          </div>
        </div>

        {/* Realtime indicator */}
        {!isConnected && (
          <div className="mb-4 py-2 px-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
            Live updates unavailable. Bids can still be placed, but you may need
            to refresh the page to see new bids.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div>
            <div className="relative aspect-square overflow-hidden bg-gray-100 mb-4 rounded-lg">
              <Image
                src={currentImage.url}
                alt={currentImage.caption || auction.title}
                fill
                className="object-contain"
              />
              <div className="absolute top-4 right-4 bg-blue-900/90 text-white px-3 py-1 text-xs rounded-full">
                {auction.stringStatus}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {auction.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {auction.images.map((image, index) => (
                  <div
                    key={image.id}
                    className={`relative aspect-square cursor-pointer overflow-hidden rounded-md ${
                      selectedImage === index
                        ? "ring-2 ring-black"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image.url}
                      alt={image.caption || `Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Recent Bids Section */}
            {recentBids.length > 0 && (
              <div className="mt-8 bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-3">Recent Bids</h3>
                <div className="space-y-2">
                  {recentBids.map((bid) => (
                    <div
                      key={`${bid.listingId}-${bid.userId}-${bid.timestamp}`}
                      className="flex justify-between items-center text-sm p-2 bg-white rounded"
                    >
                      <span className="text-gray-500">
                        {bid.userName || `User ${bid.userId.slice(0, 6)}`}
                      </span>
                      <div className="flex items-center">
                        {isAuthenticated ? (
                          <span className="font-medium">
                            ${bid.amount.toFixed(2)}
                          </span>
                        ) : (
                          <span className="font-medium text-blue-900">
                            <Link
                              href="/auth/sign-in"
                              className="hover:underline"
                            >
                              Sign in to view
                            </Link>
                          </span>
                        )}
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDistanceToNow(new Date(bid.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Auction Indicator */}
            <div className="mt-6 flex items-center space-x-2">
              <span
                className={`inline-block w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`}
              ></span>
              <span className="text-sm text-gray-600">
                {isConnected
                  ? "Live Updates Active"
                  : "Live Updates Unavailable"}
              </span>
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <h1 className="text-3xl md:text-4xl font-light mb-4">
              {auction.title}
            </h1>

            {/* Price & Status */}
            <div className="flex flex-wrap justify-between items-center mb-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-500 mb-1">Current Bid</p>
                {isAuthenticated ? (
                  <p className="text-3xl font-light">
                    $
                    {currentBid
                      ? currentBid.amount.toFixed(2)
                      : auction.startingPrice.toFixed(2)}
                  </p>
                ) : (
                  <p className="text-3xl font-light">
                    <Link
                      href="/auth/sign-in"
                      className="text-blue-900 hover:underline"
                    >
                      Sign in to view price
                    </Link>
                  </p>
                )}
                {isAuthenticated && auction.reservePrice && (
                  <p className="text-sm text-gray-500 mt-1">
                    Reserve price: ${auction.reservePrice.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Auction Ends</p>
                <p className="text-lg">{timeRemaining}</p>
              </div>
            </div>

            {/* Bid Form */}
            {auction.isActive && !isAuctionEnded && !isUserSeller && (
              <div className="mb-8">
                <form onSubmit={handleBidSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="bidAmount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Your Bid Amount
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        id="bidAmount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        step="0.01"
                        min={
                          currentBid
                            ? (currentBid.amount + 1).toString()
                            : auction.startingPrice.toString()
                        }
                        className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors"
                        placeholder="Enter your bid"
                        required
                      />
                    </div>
                    {signalRBidError && (
                      <p className="text-red-600 text-sm mt-1">
                        {signalRBidError}
                      </p>
                    )}
                    {bidSuccess && (
                      <p className="text-green-600 text-sm mt-1">
                        Your bid was placed successfully!
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isBidding}
                    className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                  >
                    {isBidding ? "Placing Bid..." : "Place Bid"}
                  </button>
                </form>

                <p className="text-xs text-gray-500 mt-2">
                  By placing a bid, you agree to our Terms of Service and
                  Auction Rules.
                </p>
              </div>
            )}

            {isUserSeller && (
              <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800 mb-2">
                  You are the seller of this auction. You cannot place bids on
                  your own listings.
                </p>
                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/edit-auction/${auction.listingId}`}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit Auction
                  </Link>

                  {/* List as Active button - only show for draft auctions */}
                  {auction.stringStatus === "Draft" && (
                    <button
                      onClick={handleActivateAuction}
                      className="text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      List as Active
                    </button>
                  )}
                </div>
              </div>
            )}

            {isAdmin && !isUserSeller && (
              <div className="mb-8 p-4 bg-gray-100 border border-gray-300 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Admin Controls</h3>
                  <span className="text-xs px-2 py-1 bg-yellow-500 text-gray-900 rounded-md">
                    Admin Access
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/edit-auction/${auction.listingId}`}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit Auction
                  </Link>
                  <button
                    onClick={handleDeleteAuction}
                    className="text-sm px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete Auction
                  </button>

                  {/* List as Active button for admin - only show for draft auctions */}
                  {auction.stringStatus === "Draft" && (
                    <button
                      onClick={handleActivateAuction}
                      className="text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      List as Active
                    </button>
                  )}
                </div>
              </div>
            )}

            {isAuctionEnded && (
              <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-800">
                  This auction has ended {timeRemaining}.
                </p>
              </div>
            )}

            {/* Item Details */}
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-4">Item Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Condition</p>
                  <p>{auction.stringCondition}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Origin</p>
                  <p>{auction.origin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p>{auction.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dimensions</p>
                  <p>{auction.dimensions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Materials</p>
                  <p>{auction.materials}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipping</p>
                  <p>{auction.stringShippingOptions}</p>
                </div>
              </div>
            </div>

            {/* Item Description */}
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-4">Description</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-line">
                  {auction.description}
                </p>
              </div>
            </div>

            {/* Q&A Section */}
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-4">Questions & Answers</h2>

              {/* Ask a question form */}
              {!isUserSeller && (
                <form onSubmit={handleAskQuestion} className="mb-6">
                  <div className="mb-3">
                    <label
                      htmlFor="question"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Ask a Question
                    </label>
                    <textarea
                      id="question"
                      rows={3}
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors"
                      placeholder="What would you like to know about this item?"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isAskingQuestion}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                  >
                    {isAskingQuestion ? "Submitting..." : "Submit Question"}
                  </button>
                </form>
              )}

              {/* Questions list */}
              <div className="space-y-4">
                {questions.length === 0 ? (
                  <p className="text-gray-500 italic">No questions yet</p>
                ) : (
                  questions.map((question) => (
                    <div
                      key={question.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">
                            Q: {question.questionText}
                          </p>
                          <p className="text-xs text-gray-500">
                            Asked{" "}
                            {formatDistanceToNow(
                              new Date(question.questionTimestamp),
                              { addSuffix: true }
                            )}
                          </p>
                        </div>

                        {/* Delete question button - only visible to asker or admin */}
                        {(isAdmin ||
                          (isAuthenticated &&
                            user?.id === question.askerId)) && (
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            title="Delete question"
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      {question.answerText ? (
                        <div className="mt-3 pl-4 border-l-2 border-gray-200">
                          <p className="text-sm">A: {question.answerText}</p>
                          <p className="text-xs text-gray-500">
                            Answered{" "}
                            {question.answerTimestamp &&
                              formatDistanceToNow(
                                new Date(question.answerTimestamp),
                                { addSuffix: true }
                              )}
                          </p>
                        </div>
                      ) : isUserSeller ? (
                        <div className="mt-3">
                          <textarea
                            rows={2}
                            value={answerTexts[question.id] || ""}
                            onChange={(e) =>
                              setAnswerTexts({
                                ...answerTexts,
                                [question.id]: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:border-black transition-colors"
                            placeholder="Answer this question..."
                          />
                          <button
                            onClick={() => handleAnswerQuestion(question.id)}
                            disabled={isAnsweringQuestion === question.id}
                            className="mt-2 px-3 py-1 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                          >
                            {isAnsweringQuestion === question.id
                              ? "Submitting..."
                              : "Submit Answer"}
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm italic text-gray-500 mt-2">
                          Awaiting seller's response
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Link
            href="/auctions"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}
