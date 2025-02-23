import { motion } from "framer-motion";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function Loading({
  size = "medium",
  className = "",
}: LoadingProps) {
  const sizeClasses = {
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
      </motion.div>
    </div>
  );
}
