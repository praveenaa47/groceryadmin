import React, { useState, useEffect } from "react";
import { X, Save, Upload, Trash2, ChevronDown, Check } from "lucide-react";
import { addCarouselItems } from "../api";
import { toast, Toaster } from "sonner";
import { getAllproducts } from "../../Product/api";

const CarouselAdd = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    products: [],
  });
  const [primaryImage, setPrimaryImage] = useState(null);
  const [secondaryImage, setSecondaryImage] = useState(null);
  const [primaryImagePreview, setPrimaryImagePreview] = useState("");
  const [secondaryImagePreview, setSecondaryImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        products:
          initialData.products?.map((p) =>
            typeof p === "object" ? p._id : p
          ) || [],
      });

      if (initialData.image) {
        setPrimaryImagePreview(
          `${process.env.REACT_APP_IMAGE_BASE_URL || ""}${initialData.image}`
        );
      }
      if (initialData.secondaryImage) {
        setSecondaryImagePreview(
          `${process.env.REACT_APP_IMAGE_BASE_URL || ""}${
            initialData.secondaryImage
          }`
        );
      }
    }
  }, [initialData]);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await getAllproducts();
      setProducts(response || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to fetch products");
    } finally {
      setProductsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, imageType) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (imageType === "primary") {
          setPrimaryImage(file);
          setPrimaryImagePreview(ev.target.result);
        } else {
          setSecondaryImage(file);
          setSecondaryImagePreview(ev.target.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.warning("Please select a valid image file");
      e.target.value = "";
    }
  };

  const removeImage = (imageType) => {
    if (imageType === "primary") {
      setPrimaryImage(null);
      setPrimaryImagePreview("");
    } else {
      setSecondaryImage(null);
      setSecondaryImagePreview("");
    }
  };

  const handleProductsChange = (productId) => {
    setFormData((prev) => {
      const isSelected = prev.products.includes(productId);
      const newProducts = isSelected
        ? prev.products.filter((id) => id !== productId)
        : [...prev.products, productId];

      return { ...prev, products: newProducts };
    });
  };

  const getSelectedProductsText = () => {
    if (formData.products.length === 0) return "Select products";
    if (formData.products.length === 1) {
      const product = products.find((p) => p._id === formData.products[0]);
      return product?.name || "Unknown product";
    }
    return `${formData.products.length} products selected`;
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!primaryImage && !initialData?.image) {
      setError("Please upload at least a primary image");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());

      if (formData.products.length > 0) {
        formData.products.forEach((productId) => {
          formDataToSend.append("products", productId);
        });
      }
      if (primaryImage) {
        formDataToSend.append("image", primaryImage);
      }
      if (secondaryImage) {
        formDataToSend.append("secondaryImage", secondaryImage);
      }
      const response = await addCarouselItems(formDataToSend);

      if (response && response.carousel) {
        onSave(response.carousel);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Error creating carousel item:", err);
      setError(err.response?.data?.message || "Failed to create carousel item");
    } finally {
      setLoading(false);
    }
  };

  const ImageUploadSection = ({
    title,
    imageType,
    preview,
    onFileChange,
    onRemove,
    required = false,
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {title} {required && "*"}
      </label>
      {!preview ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e, imageType)}
            className="hidden"
            id={`${imageType}-upload`}
          />
          <label
            htmlFor={`${imageType}-upload`}
            className="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
          >
            Click to upload an image
          </label>
        </div>
      ) : (
        <div className="relative">
          <div className="h-32 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemove(imageType)}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e, imageType)}
            className="hidden"
            id={`${imageType}-replace`}
          />
          <label
            htmlFor={`${imageType}-replace`}
            className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Replace
          </label>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setDropdownOpen(false);
        }
      }}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {initialData ? "Edit Card" : "Add New Card"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter card title"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Products
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-left flex justify-between items-center"
                disabled={loading || productsLoading}
              >
                <span
                  className={
                    formData.products.length === 0
                      ? "text-gray-500"
                      : "text-gray-900"
                  }
                >
                  {productsLoading
                    ? "Loading products..."
                    : getSelectedProductsText()}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {dropdownOpen && !productsLoading && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {products.length === 0 ? (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      No products available
                    </div>
                  ) : (
                    <div className="py-1">
                      {products.map((product) => (
                        <div
                          key={product._id}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                          onClick={() => handleProductsChange(product._id)}
                        >
                          <span className="text-sm text-gray-900">
                            {product.name}
                          </span>
                          {formData.products.includes(product._id) && (
                            <Check className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            {formData.products.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-2">Selected products:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.products.map((productId) => {
                    const product = products.find((p) => p._id === productId);
                    return (
                      <span
                        key={productId}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {product?.name || "Unknown"}
                        <button
                          type="button"
                          onClick={() => handleProductsChange(productId)}
                          className="ml-1 hover:text-blue-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <ImageUploadSection
            title="Primary Image"
            imageType="primary"
            preview={primaryImagePreview}
            onFileChange={handleFileChange}
            onRemove={removeImage}
            required={true}
          />
          <ImageUploadSection
            title="Secondary Image"
            imageType="secondary"
            preview={secondaryImagePreview}
            onFileChange={handleFileChange}
            onRemove={removeImage}
            required={false}
          />
        </div>
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {initialData ? "Update" : "Create"} Card
              </>
            )}
          </button>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default CarouselAdd;
