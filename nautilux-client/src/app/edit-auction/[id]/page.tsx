"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/utils/axios";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Loading from "@/components/loading";

type AuctionFormData = {
  title: string;
  description: string;
  startingPrice: number;
  reservePrice: number | null;
  buyNowPrice: number | null;
  startDate: string;
  endDate: string;
  isFeatured: boolean;
  isActive: boolean;
  condition: string;
  origin: string;
  year: number | null;
  dimensions: string;
  materials: string;
  authenticityId: number | null;
  shippingOptions: string;
  categoryId: number | null;
  images: {
    id?: number;
    url: string;
    isPrimary: boolean;
    caption: string;
    displayOrder: number;
  }[];
};

const CONDITIONS = ["Excellent", "Very Good", "Good", "Fair", "Poor", "Ruined"];

const SHIPPING_OPTIONS = ["None", "Econt", "Speedy", "ExpressOne"];

const CATEGORIES = [
  { id: 1, name: "Boats" },
  { id: 2, name: "Navigation Equipment" },
  { id: 3, name: "Propulsion Systems" },
  { id: 4, name: "Marine Collectibles" },
  { id: 5, name: "Vintage Nautical" },
  { id: 6, name: "Maritime Art" },
];

export default function EditAuction() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const { id } = useParams();

  const [pageLoading, setPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ url: string; caption: string }>
  >([]);
  const [imageCaption, setImageCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [originalAuction, setOriginalAuction] = useState<any>(null);

  const [formData, setFormData] = useState<AuctionFormData>({
    title: "",
    description: "",
    startingPrice: 0,
    reservePrice: null,
    buyNowPrice: null,
    startDate: "",
    endDate: "",
    isFeatured: false,
    isActive: true,
    condition: CONDITIONS[0],
    origin: "",
    year: null,
    dimensions: "",
    materials: "",
    authenticityId: null,
    shippingOptions: SHIPPING_OPTIONS[0],
    categoryId: null,
    images: [],
  });

  // Fetch auction data
  useEffect(() => {
    const fetchAuctionData = async () => {
      if (!id) return;

      try {
        const response = await api.get(`/listings/${id}`);
        const auctionData = response.data;
        setOriginalAuction(auctionData);

        // Format dates for datetime-local input
        const startDate = auctionData.startDate
          ? format(new Date(auctionData.startDate), "yyyy-MM-dd'T'HH:mm")
          : format(new Date(), "yyyy-MM-dd'T'HH:mm");

        const endDate = auctionData.endDate
          ? format(new Date(auctionData.endDate), "yyyy-MM-dd'T'HH:mm")
          : format(
              new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
              "yyyy-MM-dd'T'HH:mm"
            );

        setFormData({
          title: auctionData.title || "",
          description: auctionData.description || "",
          startingPrice: auctionData.startingPrice || 0,
          reservePrice: auctionData.reservePrice,
          buyNowPrice: auctionData.buyNowPrice,
          startDate,
          endDate,
          isFeatured: auctionData.isFeatured || false,
          isActive: auctionData.isActive || false,
          condition: auctionData.stringCondition || CONDITIONS[0],
          origin: auctionData.origin || "",
          year: auctionData.year,
          dimensions: auctionData.dimensions || "",
          materials: auctionData.materials || "",
          authenticityId: auctionData.authenticityId,
          shippingOptions:
            auctionData.stringShippingOptions || SHIPPING_OPTIONS[0],
          categoryId: auctionData.categoryId,
          images:
            auctionData.images?.map((img: any) => ({
              id: img.id,
              url: img.url,
              isPrimary: img.isPrimary,
              caption: img.caption || "",
              displayOrder: img.displayOrder,
            })) || [],
        });

        // Set uploaded images for preview
        setUploadedImages(
          auctionData.images?.map((img: any) => ({
            url: img.url,
            caption: img.caption || "",
          })) || []
        );
      } catch (error) {
        console.error("Failed to fetch auction details:", error);
        setError("Failed to load auction details. Please try again later.");
      } finally {
        setPageLoading(false);
      }
    };

    if (!isLoading && isAuthenticated) {
      fetchAuctionData();
    }
  }, [id, isAuthenticated, isLoading]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/auth/sign-in?redirect=/edit-auction/${id}`);
    }
  }, [isAuthenticated, isLoading, router, id]);

  // Check if user owns this auction
  useEffect(() => {
    if (originalAuction && user && originalAuction.sellerId !== user.id) {
      toast.error("You don't have permission to edit this auction");
      router.push(`/auctions/${id}`);
    }
  }, [originalAuction, user, router, id]);

  if (isLoading || pageLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (
    !isAuthenticated ||
    (originalAuction && user && originalAuction.sellerId !== user.id)
  ) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox" && "checked" in e.target) {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
      return;
    }

    if (
      name === "startingPrice" ||
      name === "reservePrice" ||
      name === "buyNowPrice" ||
      name === "year"
    ) {
      const numValue = value === "" ? null : Number(value);
      setFormData({
        ...formData,
        [name]: numValue,
      });
      return;
    }

    if (name === "categoryId") {
      const numValue = value === "" ? null : Number(value);
      setFormData({
        ...formData,
        [name]: numValue,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    setUploadingImage(true);

    const imageUrl = URL.createObjectURL(imageFile);

    setUploadedImages([
      ...uploadedImages,
      { url: imageUrl, caption: imageCaption },
    ]);

    setFormData({
      ...formData,
      images: [
        ...formData.images,
        {
          url: imageUrl,
          isPrimary: formData.images.length === 0,
          caption: imageCaption,
          displayOrder: formData.images.length,
        },
      ],
    });

    setImageFile(null);
    setImageCaption("");
    setUploadingImage(false);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);

    if (formData.images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    newImages.forEach((img, i) => {
      img.displayOrder = i;
    });

    setFormData({
      ...formData,
      images: newImages,
    });

    const newUploadedImages = [...uploadedImages];
    newUploadedImages.splice(index, 1);
    setUploadedImages(newUploadedImages);
  };

  const setAsPrimaryImage = (index: number) => {
    const newImages = formData.images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));

    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const apiData = {
        ...formData,
        listingId: Number(id),
        sellerId: user?.id,
        stringCondition: formData.condition,
        stringShippingOptions: formData.shippingOptions,
        stringStatus: formData.isActive ? "Active" : "Draft",
      };

      await api.put(`/listings/${id}`, apiData);
      toast.success("Auction updated successfully");
      router.push(`/auctions/${id}`);
    } catch (err) {
      console.error("Error updating auction:", err);
      setError("Failed to update auction. Please try again.");
      toast.error("Failed to update auction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-24 min-h-screen bg-neutral-50">
      <div className="bg-blue-900 py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-light text-white text-center">
            Edit Auction
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-light">Update Your Listing</h2>
            <Link
              href={`/auctions/${id}`}
              className="text-blue-900 hover:text-blue-700 font-medium"
            >
              Cancel
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">
                      Title*
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-2">
                      Description*
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-2">
                      Category*
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId || ""}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-2">
                      Condition*
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    >
                      {CONDITIONS.map((condition) => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <h3 className="text-lg font-medium mt-8 mb-4">Item Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">
                      Origin
                    </label>
                    <input
                      type="text"
                      name="origin"
                      value={formData.origin}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-2">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                      placeholder="e.g. 10cm x 15cm x 5cm"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-2">
                      Materials
                    </label>
                    <input
                      type="text"
                      name="materials"
                      value={formData.materials}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Auction Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-2">
                      Starting Price (USD)*
                    </label>
                    <input
                      type="number"
                      name="startingPrice"
                      value={formData.startingPrice}
                      onChange={handleChange}
                      required
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-2">
                      Reserve Price (USD, optional)
                    </label>
                    <input
                      type="number"
                      name="reservePrice"
                      value={formData.reservePrice || ""}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-2">
                      Buy Now Price (USD, optional)
                    </label>
                    <input
                      type="number"
                      name="buyNowPrice"
                      value={formData.buyNowPrice || ""}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-2">
                      Start Date*
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-2">
                      End Date*
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm mb-2">
                      Shipping Options*
                    </label>
                    <select
                      name="shippingOptions"
                      value={formData.shippingOptions}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    >
                      {SHIPPING_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="isActive" className="text-gray-600 text-sm">
                      List as active auction
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor="isFeatured"
                      className="text-gray-600 text-sm"
                    >
                      Feature this auction
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-4">Images</h3>
            <div className="mb-8">
              <div className="flex flex-wrap gap-4 mb-4">
                {uploadedImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="w-40 h-40 relative">
                      <Image
                        src={img.url}
                        alt={img.caption || `Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-2 bg-white">
                      <p className="text-xs text-gray-600 truncate">
                        {img.caption || "No caption"}
                      </p>
                      <div className="flex justify-between mt-1">
                        <button
                          type="button"
                          onClick={() => setAsPrimaryImage(index)}
                          className={`text-xs py-1 px-2 rounded-sm ${
                            formData.images[index]?.isPrimary
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {formData.images[index]?.isPrimary
                            ? "Primary"
                            : "Set as primary"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="text-xs py-1 px-2 bg-red-100 text-red-700 rounded-sm hover:bg-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                <div className="mb-4">
                  <label className="block text-gray-600 text-sm mb-2">
                    Add New Image
                  </label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 text-sm mb-2">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={!imageFile || uploadingImage}
                  className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors disabled:bg-gray-400"
                >
                  {uploadingImage ? "Adding..." : "Add Image"}
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <Link
                href={`/auctions/${id}`}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors disabled:bg-blue-300"
              >
                {isSubmitting ? "Updating..." : "Update Auction"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
