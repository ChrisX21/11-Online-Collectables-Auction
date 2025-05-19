"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/axios";
import { format } from "date-fns";

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
    url: string;
    isPrimary: boolean;
    caption: string;
    displayOrder: number;
  }[];
};

const CONDITIONS = ["Excellent", "Very Good", "Good", "Fair", "Poor", "Ruined"];

const SHIPPING_OPTIONS = ["None", "Econt", "Speedy", "ExpressOne"];

export default function CreateAuction() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ url: string; caption: string }>
  >([]);
  const [imageCaption, setImageCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const [formData, setFormData] = useState<AuctionFormData>({
    title: "",
    description: "",
    startingPrice: 0,
    reservePrice: null,
    buyNowPrice: null,
    startDate: format(today, "yyyy-MM-dd'T'HH:mm"),
    endDate: format(nextWeek, "yyyy-MM-dd'T'HH:mm"),
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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/sign-in?redirect=/create-auction");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
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
        sellerId: user?.id,
        stringCondition: formData.condition,
        stringShippingOptions: formData.shippingOptions,
        stringStatus: formData.isActive ? "Active" : "Draft",
      };

      const response = await api.post("/listings", apiData);

      router.push(`/auctions/${response.data.listingId}`);
    } catch (err) {
      console.error("Error creating auction:", err);
      setError("Failed to create auction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-24 min-h-screen bg-neutral-50">
      <div className="bg-blue-900 py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-light text-white text-center">
            Create New Auction
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h2 className="text-2xl font-light mb-6">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-gray-600 text-sm mb-2"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    placeholder="e.g., Vintage Mahogany Sailboat Model"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-gray-600 text-sm mb-2"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    placeholder="Provide a detailed description of your item..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="categoryId"
                      className="block text-gray-600 text-sm mb-2"
                    >
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId || ""}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="condition"
                      className="block text-gray-600 text-sm mb-2"
                    >
                      Condition <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="condition"
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
              </div>
            </section>

            <section className="pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-light mb-6">Item Details</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="origin"
                      className="block text-gray-600 text-sm mb-2"
                    >
                      Origin/Country
                    </label>
                    <input
                      type="text"
                      id="origin"
                      name="origin"
                      value={formData.origin}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                      placeholder="e.g., Italy"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="year"
                      className="block text-gray-600 text-sm mb-2"
                    >
                      Year
                    </label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      value={formData.year || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                      placeholder="e.g., 1960"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="dimensions"
                      className="block text-gray-600 text-sm mb-2"
                    >
                      Dimensions
                    </label>
                    <input
                      type="text"
                      id="dimensions"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                      placeholder="e.g., 24 x 12 x 8 inches"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="materials"
                    className="block text-gray-600 text-sm mb-2"
                  >
                    Materials
                  </label>
                  <input
                    type="text"
                    id="materials"
                    name="materials"
                    value={formData.materials}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    placeholder="e.g., Mahogany, Cotton, Brass"
                  />
                </div>
              </div>
            </section>

            <section className="pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-light mb-6">Pricing and Dates</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="startingPrice"
                      className="block text-gray-600 text-sm mb-2"
                    >
                      Starting Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="startingPrice"
                      name="startingPrice"
                      value={formData.startingPrice || ""}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="reservePrice"
                      className="block text-gray-600 text-sm mb-2"
                    >
                      Reserve Price ($)
                    </label>
                    <input
                      type="number"
                      id="reservePrice"
                      name="reservePrice"
                      value={formData.reservePrice || ""}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional. Item won't sell below this price.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="buyNowPrice"
                      className="block text-gray-600 text-sm mb-2"
                    >
                      Buy Now Price ($)
                    </label>
                    <input
                      type="number"
                      id="buyNowPrice"
                      name="buyNowPrice"
                      value={formData.buyNowPrice || ""}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional. Price to end auction instantly.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-gray-600 text-sm mb-2"
                    >
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-gray-600 text-sm mb-2"
                    >
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="shippingOptions"
                    className="block text-gray-600 text-sm mb-2"
                  >
                    Shipping Options <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="shippingOptions"
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
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="ml-2 block text-gray-600 text-sm"
                  >
                    Feature this auction (additional fees may apply)
                  </label>
                </div>
              </div>
            </section>

            <section className="pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-light mb-6">Images</h2>

              <div className="mb-8">
                <div className="mb-4">
                  <label
                    htmlFor="image"
                    className="block text-gray-600 text-sm mb-2"
                  >
                    Upload Image
                  </label>
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={uploadingImage}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                    />
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={!imageFile || uploadingImage}
                      className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {uploadingImage ? "Uploading..." : "Add Image"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Upload high-quality images of your item. First image will be
                    used as the main photo.
                  </p>
                </div>

                {formData.images.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Uploaded Images
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative border border-gray-200 rounded-lg overflow-hidden bg-white p-2"
                        >
                          <div className="aspect-square relative mb-2">
                            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
                              {image.url ? (
                                <img
                                  src={image.url}
                                  alt={image.caption || `Image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                "Image Preview"
                              )}
                            </div>
                          </div>

                          <div className="text-sm text-gray-700 truncate mb-2">
                            {image.caption || `Image ${index + 1}`}
                          </div>

                          <div className="flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => setAsPrimaryImage(index)}
                              disabled={image.isPrimary}
                              className={`text-xs px-2 py-1 rounded ${
                                image.isPrimary
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-900 hover:bg-blue-200"
                              }`}
                            >
                              {image.isPrimary ? "Primary" : "Set as Primary"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {formData.images.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-100 text-yellow-700 px-4 py-3 rounded-lg mb-6">
                  <p className="text-sm">
                    Please upload at least one image of your item.
                  </p>
                </div>
              )}
            </section>

            <section className="pt-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-full md:w-auto order-2 md:order-1">
                  <Link
                    href="/profile"
                    className="inline-block w-full md:w-auto text-center px-6 py-3 bg-white text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                </div>

                <div className="w-full md:w-auto order-1 md:order-2">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || formData.images.length === 0}
                      className="px-6 py-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                      {isSubmitting ? "Creating Auction..." : "Create Auction"}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    </main>
  );
}
