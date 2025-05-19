"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import api from "@/utils/axios";
import AuctionGrid from "@/components/AuctionGrid";
import { AuctionItem } from "@/components/AuctionCard";
import { useAuth } from "@/context/AuthContext";
import { FaAnchor, FaCompass, FaShip, FaSearch, FaGavel } from "react-icons/fa";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "Admin";
  const [isVisible, setIsVisible] = useState(false);
  const [featuredItems, setFeaturedItems] = useState<AuctionItem[]>([]);
  const [liveListings, setLiveListings] = useState<AuctionItem[]>([]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    {
      number: 1500,
      label: "Active Collectors",
      icon: <FaCompass className="mb-2 text-blue-500 mx-auto" size={24} />,
    },
    {
      number: 250,
      label: "Items Sold",
      icon: <FaAnchor className="mb-2 text-blue-500 mx-auto" size={24} />,
    },
    {
      number: 98,
      label: "Satisfaction Rate",
      icon: <FaShip className="mb-2 text-blue-500 mx-auto" size={24} />,
    },
    {
      number: 45,
      label: "Countries",
      icon: <FaSearch className="mb-2 text-blue-500 mx-auto" size={24} />,
    },
  ];

  const filterDraftAuctions = (items: AuctionItem[]) => {
    return items.filter((item) => {
      if (item.stringStatus !== "Draft") {
        return true;
      }

      if (isAdmin) {
        return true;
      }

      if (isAuthenticated && user && item.sellerId === user.id) {
        return true;
      }

      return false;
    });
  };

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await api.get("/listings/featured");
        const filtered = filterDraftAuctions(response.data);
        setFeaturedItems(filtered);
      } catch (error) {
        console.error("Failed to fetch featured items:", error);
      }
    };
    fetchFeaturedItems();
  }, [isAuthenticated, user, isAdmin]);

  useEffect(() => {
    const fetchLiveListings = async () => {
      try {
        const response = await api.get("/listings/active");
        const filtered = filterDraftAuctions(response.data);
        setLiveListings(filtered);
      } catch (error) {
        console.error("Failed to fetch active listings:", error);
      }
    };
    fetchLiveListings();
  }, [isAuthenticated, user, isAdmin]);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 z-10" />
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
                className="group relative px-8 py-4 bg-white text-black hover:bg-blue-900 hover:text-white transition-all duration-300 flex items-center"
              >
                <FaAnchor className="mr-2" size={16} />
                <span className="relative z-10">View Current Auctions</span>
                <div className="absolute inset-0 border border-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 flex items-center"
              >
                <FaShip className="mr-2" size={16} />
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center hover:-translate-y-1 transition-transform duration-300"
              >
                {stat.icon}
                <div className="text-4xl md:text-5xl font-light mb-2">
                  {stat.number}+
                </div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <AuctionGrid
        title="Featured Collection"
        description="Discover our carefully curated selection of rare maritime artifacts"
        items={featuredItems.slice(0, 6)}
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
                icon: <FaSearch className="text-blue-500 mb-4" size={24} />,
              },
              {
                step: "02",
                title: "Historical Research",
                description:
                  "Thorough documentation and provenance verification",
                icon: <FaCompass className="text-blue-500 mb-4" size={24} />,
              },
              {
                step: "03",
                title: "Technical Analysis",
                description: "Advanced testing and material verification",
                icon: <FaShip className="text-blue-500 mb-4" size={24} />,
              },
              {
                step: "04",
                title: "Final Certification",
                description:
                  "Official documentation and authentication certificate",
                icon: <FaAnchor className="text-blue-500 mb-4" size={24} />,
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative group p-6 border border-gray-100 rounded-lg hover:shadow-md transition-all"
              >
                {step.icon}
                <div className="text-6xl font-light text-gray-200 mb-4 transition-colors group-hover:text-blue-100">
                  {step.step}
                </div>
                <h3 className="text-xl font-light mb-4 group-hover:text-blue-900 transition-colors">
                  {step.title}
                </h3>
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
      <section className="py-24 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-light text-center mb-16">
            Live Auctions
          </h2>

          {liveListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {liveListings.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-white/10 p-6 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={item.image.url}
                      alt={item.title}
                      fill
                      className="object-cover rounded-lg hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-xl font-light mb-2">{item.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">
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
                      className="px-4 py-2 bg-white text-blue-900 hover:bg-gray-100 transition-colors rounded flex items-center"
                    >
                      <FaGavel className="mr-2" size={16} />
                      Place Bid
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-blue-100">
                No live auctions available at this time
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/auctions"
              className="inline-block px-8 py-4 border border-white/30 text-white hover:bg-white hover:text-blue-900 transition-colors rounded-md"
            >
              View All Auctions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
