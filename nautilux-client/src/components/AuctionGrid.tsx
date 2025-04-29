import React from "react";
import Link from "next/link";
import AuctionCard, { AuctionItem } from "./AuctionCard";

interface AuctionGridProps {
  title: string;
  description?: string;
  items: AuctionItem[];
  viewAllLink?: string;
  featured?: boolean;
}

export default function AuctionGrid({
  title,
  description,
  items,
  viewAllLink,
  featured = false,
}: AuctionGridProps) {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-light mb-4">{title}</h2>
            {description && (
              <p className="text-gray-600 max-w-xl">{description}</p>
            )}
          </div>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-black hover:text-gray-600 transition-colors group"
            >
              View All
              <span className="inline-block transition-transform group-hover:translate-x-2 ml-1">
                →
              </span>
            </Link>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <AuctionCard key={item.id} item={item} featured={featured} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
            <p className="text-gray-500">No auctions available at this time</p>
          </div>
        )}
      </div>
    </section>
  );
}
