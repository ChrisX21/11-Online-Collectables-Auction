"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

interface FavoritesContextType {
  favorites: number[];
  isLoading: boolean;
  addFavorite: (listingId: number) => Promise<void>;
  removeFavorite: (listingId: number) => Promise<void>;
  isFavorite: (listingId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user favorites when authenticated
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setFavorites([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get("/wishlist");
        // Convert listingId to number to ensure it's an integer
        setFavorites(response.data.map((fav: any) => Number(fav.listingId)));
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  const addFavorite = async (listingId: number) => {
    if (!isAuthenticated) return;

    try {
      // Check if the listing is active before adding
      const listingResponse = await api.get(`/listings/${Number(listingId)}`);
      const listing = listingResponse.data;

      // Only allow favoriting active listings (status === 1)
      if (listing.status !== 1) {
        toast.error("Only active auctions can be favorited");
        return;
      }

      // Ensure listingId is sent as an integer
      await api.post(`/wishlist/${Number(listingId)}`);
      setFavorites((prev) => [...prev, Number(listingId)]);
      toast.success("Added to favorites");
    } catch (error) {
      console.error("Failed to add favorite:", error);
      toast.error("Failed to add to favorites");
    }
  };

  const removeFavorite = async (listingId: number) => {
    if (!isAuthenticated) return;

    try {
      // Ensure listingId is an integer in the URL
      await api.delete(`/wishlist/${Number(listingId)}`);
      setFavorites((prev) => prev.filter((id) => id !== Number(listingId)));
      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      toast.error("Failed to remove from favorites");
    }
  };

  const isFavorite = (listingId: number) => {
    return favorites.includes(Number(listingId));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
