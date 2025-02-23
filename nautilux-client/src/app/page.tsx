export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 text-center">
          <h1 className=" text-4xl md:text-6xl font-bold text-blue-900">
            Nautilux Auctions
          </h1>
        </div>
        <div className="flex justify-center items-center">
          <p className="text-xl text-gray-600 text-center mt-4">
            Premier Marketplace for Exclusive Collectible Boats
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
              Welcome to Nautilux Auctions, where maritime history meets modern
              collecting. We specialize in curating the finest collection of
              rare and vintage boats, from classic wooden sailboats to historic
              luxury yachts.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              View Current Auctions
            </button>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">
              Featured Listings
            </h3>
            <ul className="space-y-4">
              <li className="border-b border-gray-200 pb-4">
                <span className="font-semibold">
                  1960s Chris-Craft Constellation
                </span>
                <p className="text-gray-600">
                  Classic wooden yacht, fully restored
                </p>
              </li>
              <li className="border-b border-gray-200 pb-4">
                <span className="font-semibold">1930s Vintage Racing Boat</span>
                <p className="text-gray-600">
                  Rare collector's piece, museum quality
                </p>
              </li>
              <li>
                <span className="font-semibold">
                  Historic America's Cup Vessel
                </span>
                <p className="text-gray-600">
                  Competition heritage, documented history
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Why Choose Nautilux Auctions?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">
                Verified Authenticity
              </h3>
              <p>Every vessel thoroughly authenticated by maritime experts</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Global Network</h3>
              <p>Connect with collectors and sellers worldwide</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">
                Secure Transactions
              </h3>
              <p>Protected bidding and payment systems</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
