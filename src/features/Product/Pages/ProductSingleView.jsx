import React, { useState } from "react";
import {
  Star,
  Package,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash,
} from "lucide-react";

function ProductSingleView() {
  const [selectedImage, setSelectedImage] = useState(0);

  const product = {
    id: "PRD-001234",
    name: "Organic Honey Crisp Apples",
    category: " Fruits",
    subcategory: "Apples",
    price: 4.99,
    originalPrice: 6.99,
    discount: 29,
    rating: 4.5,
    inStock: true,
    stockQuantity: 156,
    weight: "2 lbs bag",
    MainCategory: "Fresh Items",
    organic: true,
    dateAdded: "2024-08-01",
    status: "Active",
    description:
      "Crisp, sweet, and juicy organic honey crisp apples. Perfect for snacking, baking, or adding to your favorite recipes. Grown sustainably in Washington State orchards.",
    images: [
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500&h=500&fit=crop",
    ],
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Product Details
              </h1>
              <p className="text-sm text-gray-600">Product ID: {product.id}</p>
            </div>
            <div className="flex items-center space-x-2 gap-3">
              {product.status === "Active" ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Inactive
                </span>
              )}
                <button className="px-2 text-green-600 text-sm font-medium rounded-md ">
                    <Edit className="w-4 h-4 mr-2" />
                    </button>
                <button className="text-red-600 text-sm font-medium rounded-md ">
                    <Trash className="w-4 h-4 mr-2" />
                    </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Product Images</h2>

              {/* Main Image */}
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Product Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <p className="text-gray-900">{product.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Category
                  </label>
                  <p className="text-gray-900">{product.subcategory}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <p className="text-gray-900">{product.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Main Category
                  </label>
                  <p className="text-gray-900">{product.MainCategory}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight/Size
                  </label>
                  <p className="text-gray-900">{product.weight}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created At
                  </label>
                  <p className="text-gray-900">{product.dateAdded}</p>
                </div>
              </div>
            </div>
            {/* Pricing & Inventory */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">
                Pricing & Inventory
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Price
                  </label>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{product.price}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price
                  </label>
                  <p className="text-lg text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount
                  </label>
                  <p className="text-lg text-red-600">
                    {product.discount}% OFF
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <p className="text-lg text-gray-900 flex items-center">
                    {product.stockQuantity} units
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Status
                  </label>
                  <p
                    className={`text-lg font-medium ${
                      product.inStock ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
              </div>
            </div>
            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">
                Product Description
              </h2>
              <p className="text-gray-700">{product.description}</p>
              {/* badges */}
              <div className="flex flex-wrap gap-2 mt-4 just">
                {product.organic && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Available
                  </span>
                )}
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  Offer product
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-500 text-sm font-medium rounded-full">
                  Popular product
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                  Seasonal Product
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSingleView;
