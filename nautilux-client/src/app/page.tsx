"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import api from "@/utils/axios";
import AuctionGrid from "@/components/AuctionGrid";
import { AuctionItem } from "@/components/AuctionCard";

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [featuredItems, setFeaturedItems] = useState<AuctionItem[]>([]);
  const [liveListings, setLiveListings] = useState<AuctionItem[]>([]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { number: 1500, label: "Active Collectors" },
    { number: 250, label: "Items Sold" },
    { number: 98, label: "Satisfaction Rate" },
    { number: 45, label: "Countries" },
  ];

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await api.get("/listings/featured");
        setFeaturedItems(response.data);
      } catch (error) {
        console.error("Failed to fetch featured items:", error);
      }
    };
    fetchFeaturedItems();
  }, []);

  useEffect(() => {
    const fetchLiveListings = async () => {
      try {
        const response = await api.get("/listings/active");
        setLiveListings(response.data);
      } catch (error) {
        console.error("Failed to fetch active listings:", error);
      }
    };
    fetchLiveListings();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Parallax */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <Image
            src="/images/compass.jpg"
            alt="Luxury maritime collectibles"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container mx-auto px-4 z-20">
          <div className="max-w-3xl">
            <h1
              className={`text-6xl md:text-8xl font-light text-white mb-6 tracking-tight transition-opacity duration-1000 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              Maritime
              <span className="font-serif italic block mt-2">Collectibles</span>
            </h1>
            <p
              className={`text-xl text-gray-200 mb-8 font-light transition-opacity duration-1000 delay-300 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              Curating the world's finest maritime artifacts and historical
              treasures
            </p>
            <div
              className={`flex gap-6 transition-opacity duration-1000 delay-500 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <Link
                href="/auctions"
                className="group relative px-8 py-4 bg-white text-black hover:bg-black hover:text-white transition-all duration-300"
              >
                <span className="relative z-10">View Current Auctions</span>
                <div className="absolute inset-0 border border-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 border border-white text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-light mb-2">
                  {stat.number}+
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <AuctionGrid
        title="Featured Collection"
        description="Discover our carefully curated selection of rare maritime artifacts"
        items={featuredItems}
        viewAllLink="/catalog"
        featured={true}
      />

      {/* Authentication Process */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-light text-center mb-16">
            Our Authentication Process
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Initial Assessment",
                description:
                  "Expert evaluation of item condition and authenticity",
              },
              {
                step: "02",
                title: "Historical Research",
                description:
                  "Thorough documentation and provenance verification",
              },
              {
                step: "03",
                title: "Technical Analysis",
                description: "Advanced testing and material verification",
              },
              {
                step: "04",
                title: "Final Certification",
                description:
                  "Official documentation and authentication certificate",
              },
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className="text-6xl font-light text-gray-200 mb-4 transition-colors group-hover:text-gray-300">
                  {step.step}
                </div>
                <h3 className="text-xl font-light mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-full h-px bg-gray-200 transform translate-x-20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Auctions Section */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-light text-center mb-16">
            Live Auctions
          </h2>

          {liveListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {liveListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/10 p-6 rounded-lg backdrop-blur-sm"
                >
                  <div className="relative h-48 mb-4">
                    <Image
                      src={item.image.url}
                      alt={item.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-xl font-light mb-2">{item.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg">
                      $
                      {item.currentBid
                        ? item.currentBid.amount.toFixed(2)
                        : item.startingPrice.toFixed(2)}
                    </span>
                    <Link
                      href={`/auctions/${item.id}`}
                      className="px-4 py-2 bg-white text-black hover:bg-gray-100 transition-colors rounded"
                    >
                      Place Bid
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">
                No live auctions available at this time
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/auctions"
              className="inline-block px-8 py-4 border border-white/30 text-white hover:bg-white hover:text-black transition-colors rounded-md"
            >
              View All Auctions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
