import React, { useState } from "react";
import {
  Save,
  X,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Package,
  DollarSign,
  Tag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dealoftheday = () => {
  const [formData, setFormData] = useState({
    productName: "",
    offerPrice: "",
    description: "",
    stock: "",
    validTill: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const products = [
    { name: "Fresh Tomatoes (1 kg)", originalPrice: 3.99 },
    { name: "Onions (1 kg)", originalPrice: 2.49 },
    { name: "Potatoes (1 kg)", originalPrice: 2.99 },
    { name: "Carrots (500g)", originalPrice: 1.99 },
    { name: "Green Beans (500g)", originalPrice: 2.79 },
    { name: "Bell Peppers (500g)", originalPrice: 3.49 },
    { name: "Spinach (250g)", originalPrice: 2.29 },
  ];

  const navigate = useNavigate()
  const handlecancel=()=>{
    navigate("/dealpage")
  }
  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName) {
      newErrors.productName = "Product selection is required";
    }

    if (!formData.offerPrice || parseFloat(formData.offerPrice) <= 0) {
      newErrors.offerPrice = "Valid offer price is required";
    }

    const selectedProduct = products.find(
      (p) => p.name === formData.productName
    );
    if (
      selectedProduct &&
      formData.offerPrice &&
      parseFloat(formData.offerPrice) >= selectedProduct.originalPrice
    ) {
      newErrors.offerPrice = "Offer price must be less than original price";
    }

    if (!formData.stock || parseInt(formData.stock) <= 0) {
      newErrors.stock = "Valid stock quantity is required";
    }

    if (!formData.validTill) {
      newErrors.validTill = "Valid till date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      setTimeout(() => {
        setFormData({
          productName: "",
          offerPrice: "",
          description: "",
          stock: "",
          validTill: "",
        });
        setShowSuccess(false);
      }, 2000);
    }, 1500);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const calculateDiscount = () => {
    const selectedProduct = products.find(
      (p) => p.name === formData.productName
    );
    if (selectedProduct && formData.offerPrice) {
      const original = selectedProduct.originalPrice;
      const offer = parseFloat(formData.offerPrice);
      if (original > offer) {
        return Math.round(((original - offer) / original) * 100);
      }
    }
    return 0;
  };

  const getSavingsAmount = () => {
    const selectedProduct = products.find(
      (p) => p.name === formData.productName
    );
    if (selectedProduct && formData.offerPrice) {
      const original = selectedProduct.originalPrice;
      const offer = parseFloat(formData.offerPrice);
      if (original > offer) {
        return (original - offer).toFixed(2);
      }
    }
    return "0.00";
  };

  const getOriginalPrice = () => {
    const selectedProduct = products.find(
      (p) => p.name === formData.productName
    );
    return selectedProduct ? selectedProduct.originalPrice : 0;
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-green-600 mb-4">
            <CheckCircle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Deal Added Successfully!
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        {/* Header */}
        <div className="mb-8">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Deal Management
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Add New Vegetable Deal
          </h1>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Product Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product *
                </label>
                <select
                  value={formData.productName}
                  onChange={(e) =>
                    handleInputChange("productName", e.target.value)
                  }
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.productName ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Choose a vegetable product</option>
                  {products.map((product) => (
                    <option key={product.name} value={product.name}>
                      {product.name} - ₹{product.originalPrice.toFixed(2)}
                    </option>
                  ))}
                </select>
                {errors.productName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productName}
                  </p>
                )}
              </div>

              {/* Valid Till */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Till *
                </label>
                <input
                  type="date"
                  value={formData.validTill}
                  onChange={(e) => handleInputChange('validTill', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.validTill ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.validTill && (
                  <p className="text-red-500 text-sm mt-1">{errors.validTill}</p>
                )}
              </div> */}
              <div className="bg-white p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Offer Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Price * (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.offerPrice}
                      onChange={(e) =>
                        handleInputChange("offerPrice", e.target.value)
                      }
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.offerPrice ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0.00"
                    />
                    {errors.offerPrice && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.offerPrice}
                      </p>
                    )}
                    {formData.productName && (
                      <p className="text-sm text-gray-600 mt-1">
                        Original Price: ₹{getOriginalPrice().toFixed(2)}
                      </p>
                    )}
                  </div>
                  {formData.productName && formData.offerPrice && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Deal Preview
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 line-through">
                            ₹{getOriginalPrice().toFixed(2)}
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            ₹{parseFloat(formData.offerPrice).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                            {calculateDiscount()}% OFF
                          </span>
                          <span className="text-green-600 font-medium">
                            Save ₹{getSavingsAmount()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <button
            onClick={handlecancel}
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding Deal...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Add Deal
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dealoftheday;
