// components/ComboOfferModal.jsx
import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import ProductSelection from "./ProductSelection";

const ComboOfferModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  loading,
  formData,
  setFormData,
  categories,
  availableProducts,
  productsLoading
}) => {
  const [localFormData, setLocalFormData] = useState(formData);

  useEffect(() => {
    if (isOpen) {
      setLocalFormData(formData);
    }
  }, [isOpen, formData]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setLocalFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setLocalFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData(localFormData);
    onSubmit(localFormData);
  };

  const addProduct = () => {
    setLocalFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          productId: "",
          weight: "",
          measurm: "kg",
          quantity: 1,
          selectedWeight: "",
        },
      ],
    }));
  };

  const removeProduct = (index) => {
    setLocalFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const updateProduct = (index, field, value) => {
    setLocalFormData((prev) => ({
      ...prev,
      products: prev.products.map((product, i) => {
        if (i === index) {
          const updatedProduct = { ...product, [field]: value };

          // If productId is being updated, reset weight-related fields
          if (field === "productId") {
            const selectedProduct = availableProducts.find(
              (p) => p._id === value
            );
            if (selectedProduct) {
              updatedProduct.weight = "";
              updatedProduct.selectedWeight = "";
              updatedProduct.measurm = "kg";
            }
          }

          // If selectedWeight is being updated, parse and set weight and unit
          if (field === "selectedWeight" && value) {
            // Find the selected weight option to get the exact data
            const selectedProduct = availableProducts.find(
              (p) => p._id === product.productId
            );
            if (selectedProduct && selectedProduct.weightsAndStocks) {
              const selectedWeightData = selectedProduct.weightsAndStocks.find(
                (ws) => `${ws.weight}${ws.measurm}` === value
              );
              if (selectedWeightData) {
                updatedProduct.weight = selectedWeightData.weight;
                updatedProduct.measurm = selectedWeightData.measurm;
                updatedProduct.weightPrice = selectedWeightData.weight_price;
                updatedProduct.availableStock = selectedWeightData.quantity;
              }
            }
          }

          return updatedProduct;
        }
        return product;
      }),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? "Edit Combo Offer" : "Add New Combo Offer"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Combo Name *
              </label>
              <input
                type="text"
                name="name"
                value={localFormData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter combo name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={localFormData.category}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>

              {categories.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  No categories available. Please add categories first.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleInputChange}
                accept="image/*"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Products Section */}
          <ProductSelection
            products={localFormData.products}
            availableProducts={availableProducts}
            productsLoading={productsLoading}
            addProduct={addProduct}
            removeProduct={removeProduct}
            updateProduct={updateProduct}
          />

          {/* Discount Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Discount Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type
                </label>
                <select
                  name="discountType"
                  value={localFormData.discountType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value *
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={localFormData.discountValue}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={
                    localFormData.discountType === "fixed" ? "100" : "10"
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Validity Period
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={localFormData.startDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={localFormData.endDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={localFormData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              Active (immediately available for customers)
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !localFormData.name ||
                !localFormData.category ||
                localFormData.products.length === 0
              }
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Combo"
              ) : (
                "Create Combo"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComboOfferModal;