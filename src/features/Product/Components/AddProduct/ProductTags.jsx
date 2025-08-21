import React from "react";
import { CheckCircle } from "lucide-react";

const ProductTags = ({ productFlags, toggleProductFlag }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Product Tags</h2>
      <p className="text-sm text-gray-600 mb-4">
        Toggle the product characteristics
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => toggleProductFlag("isAvailable")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            productFlags.isAvailable
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <CheckCircle className="w-4 h-4 inline mr-1" />
          Available
        </button>

        <button
          type="button"
          onClick={() => toggleProductFlag("isOfferProduct")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            productFlags.isOfferProduct
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Offer Product
        </button>

        <button
          type="button"
          onClick={() => toggleProductFlag("isPopular")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            productFlags.isPopular
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Popular Product
        </button>

        <button
          type="button"
          onClick={() => toggleProductFlag("isSeasonal")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            productFlags.isSeasonal
              ? "bg-purple-500 text-white hover:bg-purple-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Seasonal Product
        </button>
      </div>
    </div>
  );
};

export default ProductTags;