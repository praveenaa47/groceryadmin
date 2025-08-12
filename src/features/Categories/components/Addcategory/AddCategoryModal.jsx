import React, { useState } from "react";
import { X, Upload, Camera } from "lucide-react";

export function AddCategoryModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    mainCategory: "",
    name: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setFormData((prev) => ({ ...prev, image: imageUrl }));
        setImagePreview(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.mainCategory.trim()) {
      newErrors.mainCategory = "Main category name is required";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }
    if (!formData.image.trim()) {
      newErrors.image = "Category image is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        id: Date.now(),
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({ mainCategory: "", name: "", image: "" });
    setImagePreview("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Add New Category
            </h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-6">
              <label
                htmlFor="mainCategory"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Main Category Name *
              </label>
              <input
                type="text"
                id="mainCategory"
                name="mainCategory"
                value={formData.mainCategory}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
                  errors.mainCategory ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter main category name"
              />
              {errors.mainCategory && (
                <p className="mt-1 text-sm text-red-600">{errors.mainCategory}</p>
              )}
            </div>

            {/* Category Name */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter category name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Category Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Image *
              </label>
              <div className="mb-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/100x100/f3f4f6/6b7280?text=${
                          formData.name.charAt(0) || "?"
                        }`;
                      }}
                    />
                  ) : (
                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  )}
                </div>
              </div>
              <div className="text-center">
                <label htmlFor="imageUpload" className="block mt-2">
                  <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-700">Upload Image</span>
                  </div>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.image && (
                <p className="mt-2 text-sm text-red-600">{errors.image}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full sm:flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
