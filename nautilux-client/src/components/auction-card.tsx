import React from "react";

interface AuctionCardProps {
  title: string;
  description: string;
  image: string;
  index?: number;
}

export default function AuctionCard({
  title,
  description,
  image,
  index = 0,
}: AuctionCardProps) {
  // Generate a random current bid for demo purposes
  const currentBid = Math.floor(Math.random() * 3000) + 500;

  // Random time remaining (1-5 days from now)
  const daysAhead = Math.floor(Math.random() * 5) + 1;
  const endDate = new Date(Date.now() + daysAhead * 86400000);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-52 object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-blue-800 text-white text-xs font-bold px-2.5 py-1.5 rounded-md">
          Live Auction
        </div>
      </div>

      <div className="p-5">
        <h1 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {title}
        </h1>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">
              Current Bid
            </p>
            <p className="text-lg font-bold text-blue-900">
              ${currentBid.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-medium">
              Ends In
            </p>
            <p className="text-sm font-medium text-gray-700">
              {endDate.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <button className="flex-1 bg-blue-800 hover:bg-blue-900 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center">
            View Details
          </button>
          <button className="flex-1 bg-green-700 hover:bg-green-800 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center">
            Place Bid
          </button>
        </div>
      </div>
    </div>
  );
}
