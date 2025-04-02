import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-2 text-center">
          <h1 className=" text-4xl md:text-6xl font-bold text-blue-900">
            Nautilux Collectibles
          </h1>
        </div>
        <div className="flex items-center">
          <p className="text-xl text-gray-600">
            Premier Auction Platform for Marine Collectibles and Memorabilia
          </p>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-blue-800 mb-6">
              Discover Rare Maritime Treasures
            </h2>
            <p className="text-gray-700 mb-4">
              Welcome to Nautilux Collectibles, where maritime enthusiasts
              connect to buy and sell unique marine artifacts and memorabilia.
              Whether you're a collector looking to find that missing piece or a
              seller wanting to auction your treasured items, our platform
              brings the maritime collecting community together.
            </p>
            <Link
              href={"/auctions"}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Explore Active Auctions
            </Link>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">
              Featured Collectibles
            </h3>
            <ul className="space-y-4">
              <li className="border-b border-gray-200 pb-4">
                <span className="font-semibold">
                  1912 Titanic Commemorative Medal
                </span>
                <p className="text-gray-600">
                  Rare bronze medal, excellent condition
                </p>
              </li>
              <li className="border-b border-gray-200 pb-4">
                <span className="font-semibold">Vintage Naval Sextant</span>
                <p className="text-gray-600">
                  WWII era, brass construction with original case
                </p>
              </li>
              <li>
                <span className="font-semibold">
                  Captain's Pocket Chronometer
                </span>
                <p className="text-gray-600">
                  19th century, silver-cased with documented provenance
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Why Choose Nautilux Collectibles?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">
                Collector to Collector
              </h3>
              <p>
                Connect directly with fellow enthusiasts in our passionate
                community
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">
                Expert Verification
              </h3>
              <p>
                Optional authentication services for high-value maritime
                collectibles
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Secure Auctions</h3>
              <p>
                Protected bidding system and transparent transaction process
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
