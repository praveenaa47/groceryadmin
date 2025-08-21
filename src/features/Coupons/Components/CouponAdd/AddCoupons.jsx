import React, { useState, useEffect } from "react";
import {
  Save,
  X,
  Calendar,
  Tag,
  Percent,
  DollarSign,
  Users,
  ShoppingCart,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { getAllproducts } from "../../../Product/api";
import { getAllCategory } from "../../../Categories/api";
import { createCoupon } from "../../api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../lib/constants";

const AddCoupons = ({
  onSave = () => {},
  onCancel = () => {},
  title = "Add New Coupon",
}) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    usageLimit: "",
    expiryDate: "",
    status: "active",
    applicationType: "category",
    selectedCategories: [],
    selectedProducts: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      setDataError(null);

      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          getAllCategory(),
          getAllproducts(),
        ]);

        if (categoriesResponse && categoriesResponse.categories) {
          setCategories(categoriesResponse.categories);
        } else if (Array.isArray(categoriesResponse)) {
          setCategories(categoriesResponse);
        } else {
          console.warn(
            "Unexpected categories response format:",
            categoriesResponse
          );
          setCategories([]);
        }

        if (productsResponse && productsResponse.products) {
          setProducts(productsResponse.products);
        } else if (Array.isArray(productsResponse)) {
          setProducts(productsResponse);
        } else {
          console.warn(
            "Unexpected products response format:",
            productsResponse
          );
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setDataError(
          "Failed to load categories and products. Please try again."
        );
        setCategories([]);
        setProducts([]);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitMessage.text) {
      setSubmitMessage({ type: "", text: "" });
    }
  };

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter((id) => id !== categoryId)
        : [...prev.selectedCategories, categoryId],
    }));
  };

  const handleProductChange = (productId) => {
    setFormData((prev) => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter((id) => id !== productId)
        : [...prev.selectedProducts, productId],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    } else if (formData.code.length < 3) {
      newErrors.code = "Coupon code must be at least 3 characters";
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = "Discount value must be greater than 0";
    }

    if (
      formData.discountType === "percentage" &&
      formData.discountValue > 100
    ) {
      newErrors.discountValue = "Percentage discount cannot exceed 100%";
    }

    if (!formData.usageLimit || formData.usageLimit <= 0) {
      newErrors.usageLimit = "Usage limit must be greater than 0";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (new Date(formData.expiryDate) <= new Date()) {
      newErrors.expiryDate = "Expiry date must be in the future";
    }

    if (
      formData.applicationType === "category" &&
      formData.selectedCategories.length === 0
    ) {
      newErrors.application = "Please select at least one category";
    }

    if (
      formData.applicationType === "product" &&
      formData.selectedProducts.length === 0
    ) {
      newErrors.application = "Please select at least one product";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareAPIPayload = () => {
    return {
      code: formData.code.trim().toUpperCase(),
      status: formData.status,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      usageLimit: Number(formData.usageLimit),
      expiryDate: new Date(formData.expiryDate).toISOString(),
      applicationType: formData.applicationType,
      applicableCategories:
        formData.applicationType === "category"
          ? formData.selectedCategories
          : [],
      applicableProducts:
        formData.applicationType === "product"
          ? formData.selectedProducts.map((id) => {
              const product = products.find((p) => p.id === id || p._id === id);
              return product?._id || product?.id || id;
            })
          : [],
    };
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      usageLimit: "",
      expiryDate: "",
      status: "active",
      applicationType: "category",
      selectedCategories: [],
      selectedProducts: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    try {
      const payload = prepareAPIPayload();
      console.log("Sending coupon data:", payload);

      const response = await createCoupon(payload);

      if (response && response.coupon) {
        toast.success("successfully created ");
        navigate(`${ROUTES.COUPONS}`);
        onSave(response.coupon);
        setTimeout(() => {
          resetForm();
          setSubmitMessage({ type: "", text: "" });
        }, 2000);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      setSubmitMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to create coupon. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const retryFetchData = async () => {
    setIsLoadingData(true);
    setDataError(null);

    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        getAllCategory(),
        getAllproducts(),
      ]);

      if (categoriesResponse && categoriesResponse.categories) {
        setCategories(categoriesResponse.categories);
      } else if (Array.isArray(categoriesResponse)) {
        setCategories(categoriesResponse);
      }

      if (productsResponse && productsResponse.products) {
        setProducts(productsResponse.products);
      } else if (Array.isArray(productsResponse)) {
        setProducts(productsResponse);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setDataError("Failed to load categories and products. Please try again.");
    } finally {
      setIsLoadingData(false);
    }
  };

  // Loading state
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading categories and products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div>
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Data Error Message */}
        {dataError && (
          <div className="mb-6 p-4 rounded-lg border bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800 font-medium">Data Loading Issue</p>
            </div>
            <p className="text-yellow-700 text-sm mb-3">{dataError}</p>
            <button
              onClick={retryFetchData}
              className="text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded border border-yellow-300 transition-colors"
            >
              Retry Loading Data
            </button>
          </div>
        )}

        {/* Success/Error Messages */}
        {submitMessage.text && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              submitMessage.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., SAVE20"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.code ? "border-red-500" : "border-gray-300"
                  } ${isSubmitting ? "bg-gray-100" : ""}`}
                />
                {errors.code && (
                  <p className="text-red-500 text-xs mt-1">{errors.code}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isSubmitting ? "bg-gray-100" : ""
                  }`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Percent className="w-5 h-5" />
              Discount Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isSubmitting ? "bg-gray-100" : ""
                  }`}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value *
                </label>
                <div className="relative">
                  {formData.discountType === "percentage" ? (
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  ) : (
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  )}
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    placeholder={
                      formData.discountType === "percentage" ? "20" : "50"
                    }
                    min="0"
                    max={
                      formData.discountType === "percentage" ? "100" : undefined
                    }
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.discountValue
                        ? "border-red-500"
                        : "border-gray-300"
                    } ${isSubmitting ? "bg-gray-100" : ""}`}
                  />
                </div>
                {errors.discountValue && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.discountValue}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Limit *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    placeholder="100"
                    min="1"
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.usageLimit ? "border-red-500" : "border-gray-300"
                    } ${isSubmitting ? "bg-gray-100" : ""}`}
                  />
                </div>
                {errors.usageLimit && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.usageLimit}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    min={getMinDate()}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.expiryDate ? "border-red-500" : "border-gray-300"
                    } ${isSubmitting ? "bg-gray-100" : ""}`}
                  />
                </div>
                {errors.expiryDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.expiryDate}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Apply Coupon To
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Type *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="applicationType"
                    value="category"
                    checked={formData.applicationType === "category"}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    By Category
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="applicationType"
                    value="product"
                    checked={formData.applicationType === "product"}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    By Products
                  </span>
                </label>
              </div>
            </div>

            {formData.applicationType === "category" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Categories * ({categories.length} available)
                </label>
                {categories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No categories available</p>
                    <button
                      onClick={retryFetchData}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Retry loading categories
                    </button>
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label
                          key={category.id || category._id}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.selectedCategories.includes(
                              category.id || category._id
                            )
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          } ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.selectedCategories.includes(
                                category.id || category._id
                              )}
                              onChange={() =>
                                !isSubmitting &&
                                handleCategoryChange(
                                  category.id || category._id
                                )
                              }
                              disabled={isSubmitting}
                              className="text-blue-600 focus:ring-blue-500 mr-3"
                            />
                            <div className="flex items-center">
                              {category.icon && (
                                <span className="text-xl mr-3">
                                  {category.icon}
                                </span>
                              )}
                              <div className="text-sm font-medium text-gray-900">
                                {category.name ||
                                  category.categoryName ||
                                  "Unnamed Category"}
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {formData.applicationType === "product" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Products * ({products.length} available)
                </label>
                {products.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No products available</p>
                    <button
                      onClick={retryFetchData}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Retry loading products
                    </button>
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    <div className="space-y-2">
                      {products.map((product) => (
                        <label
                          key={product?.id || product?._id}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.selectedProducts.includes(
                              product?.id || product?._id
                            )
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          } ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.selectedProducts.includes(
                                product?.id || product?._id
                              )}
                              onChange={() =>
                                !isSubmitting &&
                                handleProductChange(product?.id || product?._id)
                              }
                              disabled={isSubmitting}
                              className="text-blue-600 focus:ring-blue-500 mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {product?.name ||
                                  product?.productName ||
                                  "Unnamed Product"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {product?.category.name ||
                                  product?.categoryName ||
                                  "No Category"}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-gray-700">
                            ₹{product?.price || product?.salePrice || 0}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {errors.application && (
              <p className="text-red-500 text-xs mt-2">{errors.application}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Coupon
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default AddCoupons;
