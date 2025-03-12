"use client";
import { motion } from "framer-motion";
import AuctionCard from "@/components/auction-card";

export default function Auctions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-900"
        >
          Live Auctions
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {[
            {
              title: "Vintage Watch Collection",
              description:
                "Rare collection of vintage watches from the 1950s in excellent condition.",
              image: "https://placehold.co/600x400/png",
            },
            {
              title: "Modern Art Painting",
              description:
                "Original abstract painting by contemporary artist Jane Doe.",
              image: "https://placehold.co/600x400/png",
            },
            {
              title: "Antique Furniture Set",
              description:
                "Beautifully preserved Victorian-era furniture set including chairs and table.",
              image: "https://placehold.co/600x400/png",
            },
            {
              title: "Rare Book Collection",
              description:
                "First edition classics from renowned authors of the 20th century.",
              image: "https://placehold.co/600x400/png",
            },
            {
              title: "Sports Memorabilia",
              description:
                "Signed jerseys and equipment from championship teams and legendary athletes.",
              image: "https://placehold.co/600x400/png",
            },
            {
              title: "Luxury Jewelry",
              description:
                "Exquisite diamond and gold jewelry pieces from a private collection.",
              image: "https://placehold.co/600x400/png",
            },
          ].map((auction, index) => (
            <AuctionCard
              key={index}
              title={auction.title}
              description={auction.description}
              image={auction.image}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
