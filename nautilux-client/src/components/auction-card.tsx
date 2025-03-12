import { motion } from "framer-motion";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-100 overflow-hidden"
    >
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 + index * 0.05 }}
          className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full"
        >
          Live
        </motion.div>
      </div>
      <div className="p-5">
        <h1 className="text-xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            Ends: {new Date(Date.now() + 86400000).toLocaleDateString()}
          </span>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex-1 sm:flex-none text-center">
              View
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex-1 sm:flex-none text-center">
              Bid Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
