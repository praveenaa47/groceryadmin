import React, { useEffect, useState } from "react";
import { X, Upload, Camera, Palette } from "lucide-react";
import { ChromePicker } from "react-color";
import { BASE_URL } from "../../../../lib/constants";

export function EditMainCategory({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    imageFile: null,
    primaryColor: "",
    secondaryColor: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);

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
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        image: initialData.image || "",
        imageFile: null,
        primaryColor: initialData.primaryColor || "",
        secondaryColor: initialData.secondaryColor || "",
      });
      setImagePreview(
        initialData.image ? `${BASE_URL}/uploads/${initialData.image}` : ""
      );
    }
  }, [initialData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        image: "",
      }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    }
  };

  const handleColorChange = (colorType, color) => {
    setFormData((prev) => ({
      ...prev,
      [colorType]: color.hex,
    }));
  };

  const handleColorInputChange = (colorType, value) => {
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexPattern.test(value) || value === "") {
      setFormData((prev) => ({
        ...prev,
        [colorType]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }
    if (!formData.image.trim() && !formData.imageFile) {
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
    setFormData({
      name: "",
      image: "",
      imageFile: null,
      primaryColor: "",
      secondaryColor: "",
    });
    setImagePreview("");
    setErrors({});
    setShowPrimaryPicker(false);
    setShowSecondaryPicker(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
        onClick={handleClose}
      ></div>
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Edit main category
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
                      // onError={(e) => {
                      //   e.target.src = `https://via.placeholder.com/100x100/f3f4f6/6b7280?text=${
                      //     formData.name.charAt(0) || "?"
                      //   }`;
                      // }}
                    />
                  ) : (
                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  )}
                </div>
              </div>
              {/* File Upload */}
              <div className="text-center">
                <label htmlFor="imageUpload" className="block">
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
                <p className="mt-2 text-sm text-red-600">{errors.icon}</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Category Colors
              </label>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Primary Color
                </label>
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm"
                      style={{ backgroundColor: formData.primaryColor }}
                      onClick={() => {
                        setShowPrimaryPicker(!showPrimaryPicker);
                        setShowSecondaryPicker(false);
                      }}
                    ></div>
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        handleColorInputChange("primaryColor", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors text-sm font-mono"
                      placeholder="#d19f17"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowPrimaryPicker(!showPrimaryPicker);
                        setShowSecondaryPicker(false);
                      }}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Palette className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  {showPrimaryPicker && (
                    <div className="absolute top-12 left-0 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                      <ChromePicker
                        color={formData.primaryColor}
                        onChange={(color) =>
                          handleColorChange("primaryColor", color)
                        }
                        disableAlpha={true}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Secondary Color
                </label>
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm"
                      style={{ backgroundColor: formData.secondaryColor }}
                      onClick={() => {
                        setShowSecondaryPicker(!showSecondaryPicker);
                        setShowPrimaryPicker(false);
                      }}
                    ></div>
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) =>
                        handleColorInputChange("secondaryColor", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors text-sm font-mono"
                      placeholder="#dedad1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowSecondaryPicker(!showSecondaryPicker);
                        setShowPrimaryPicker(false);
                      }}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Palette className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  {showSecondaryPicker && (
                    <div className="absolute top-12 left-0 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                      <ChromePicker
                        color={formData.secondaryColor}
                        onChange={(color) =>
                          handleColorChange("secondaryColor", color)
                        }
                        disableAlpha={true}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg border border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-600 mb-2">Color Preview:</p>
                <div className="flex gap-2">
                  <div className="flex-1 text-center">
                    <div
                      className="w-full h-8 rounded-md border border-gray-300"
                      style={{ backgroundColor: formData.primaryColor }}
                    ></div>
                    <p className="text-xs text-gray-500 mt-1">Primary</p>
                  </div>
                  <div className="flex-1 text-center">
                    <div
                      className="w-full h-8 rounded-md border border-gray-300"
                      style={{ backgroundColor: formData.secondaryColor }}
                    ></div>
                    <p className="text-xs text-gray-500 mt-1">Secondary</p>
                  </div>
                </div>
              </div>
            </div>
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
      {(showPrimaryPicker || showSecondaryPicker) && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => {
            setShowPrimaryPicker(false);
            setShowSecondaryPicker(false);
          }}
        ></div>
      )}
    </div>
  );
}
