"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[50vh] bg-blue-900 flex items-center">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/about-hero.jpg"
            alt="Nautilux Auctions"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-light mb-4">
            About Nautilux
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl font-light">
            Your trusted platform for premium boat and nautical collectables
            auctions
          </p>
          <div className="inline-block mt-6 px-4 py-2 bg-white text-blue-900 rounded-lg text-sm font-medium">
            Diploma Project
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-light mb-8 text-center">
              Our Mission
            </h2>
            <p className="text-gray-700 mb-6 text-lg">
              At Nautilux, we're passionate about creating the best platform for
              online bidding on collectible items from the marine world. Our
              platform provides a secure, transparent, and exciting environment
              for buying and selling premium collectables.
            </p>
            <p className="text-gray-700 mb-6 text-lg">
              We believe in the power of authenticity and trust. Every auction
              on our platform is carefully vetted to ensure the highest quality
              standards, giving both buyers and sellers confidence in every
              transaction.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light mb-12 text-center">
            What Makes Us Different
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-50 p-6 rounded-lg">
              <div className="h-14 w-14 bg-blue-900 rounded-full flex items-center justify-center text-white mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl mb-4 font-medium">Secure Bidding</h3>
              <p className="text-gray-600">
                Our platform uses advanced security measures to protect your
                information and ensure all bidding activities are safe and
                legitimate.
              </p>
            </div>

            <div className="bg-neutral-50 p-6 rounded-lg">
              <div className="h-14 w-14 bg-blue-900 rounded-full flex items-center justify-center text-white mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl mb-4 font-medium">Real-time Updates</h3>
              <p className="text-gray-600">
                Get instant notifications about bid status, auction endings, and
                new listings that match your interests.
              </p>
            </div>

            <div className="bg-neutral-50 p-6 rounded-lg">
              <div className="h-14 w-14 bg-blue-900 rounded-full flex items-center justify-center text-white mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl mb-4 font-medium">Fair Pricing</h3>
              <p className="text-gray-600">
                Our transparent bidding system ensures that all participants
                have equal opportunities to win auctions at fair market prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Project */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-light mb-4">Diploma Project</h2>
            <p className="text-gray-600 mb-8">
              Nautilux is a diploma project developed as part of our final year
              studies. Our team has worked diligently to create a professional,
              functional online auction platform that showcases our technical
              skills and business knowledge.
            </p>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-10">
              <h3 className="text-xl mb-4 font-medium">Project Details</h3>
              <ul className="text-left space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-900">•</span>
                  <span>
                    Developed using Next.js, React, and ASP .NET Core 6 for the
                    web API.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-900">•</span>
                  <span>
                    Implemented secure user authentication from scratch
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-900">•</span>
                  <span>
                    Implemented SignalR for real-time bidding and notifications
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-6">Ready to Start Bidding?</h2>
          <p className="text-xl font-light mb-8 max-w-2xl mx-auto">
            Join our community of collectors and enthusiasts today and discover
            unique nautical treasures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auctions"
              className="px-6 py-3 bg-white text-blue-900 hover:bg-gray-100 transition-colors rounded-lg font-medium"
            >
              Browse Auctions
            </Link>
            <Link
              href="/auth/sign-up"
              className="px-6 py-3 border border-white hover:bg-white/10 transition-colors rounded-lg text-white font-medium"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
