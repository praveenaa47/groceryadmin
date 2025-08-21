import React, { useEffect, useState } from "react";
import { X, Upload, Camera, ChevronDown } from "lucide-react";
import { updateSubCategory, getAllCategory } from "../../api";
import { toast, Toaster } from "sonner";

export function EditSubcategoryModal({ isOpen, onClose, onSave, categoryToEdit }) {
  const [formData, setFormData] = useState({
    mainCategory: "",
    name: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (categoryToEdit) {
        populateForm();
      }
    }
  }, [isOpen, categoryToEdit]);

  const fetchCategories = async () => {
    setIsFetchingCategories(true);
    try {
      const response = await getAllCategory();
      setCategories(response.data || response || []);
    } catch (error) {
      toast.error("Failed to fetch categories");
      setCategories([]);
    } finally {
      setIsFetchingCategories(false);
    }
  };

  const populateForm = () => {
    if (categoryToEdit) {
      setFormData({
        mainCategory: categoryToEdit.categoryId || "",
        name: categoryToEdit.name || "",
        image: null, 
      });
      setImagePreview(categoryToEdit.image || "");
    }
  };

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
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.onerror = () => {
        toast.error("Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.mainCategory.trim()) {
      newErrors.mainCategory = "Main category selection is required";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Subcategory name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("category", formData.mainCategory); 
        formDataToSend.append("name", formData.name);
        if (formData.image) {
          formDataToSend.append("image", formData.image);
        }
        const response = await updateSubCategory(categoryToEdit.id, formDataToSend);
        toast.success("Subcategory updated successfully");
        if (onSave && response.subcategory) {
          onSave(response.subcategory);
        }
        handleClose();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error updating subcategory");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({ mainCategory: "", name: "", image: null });
    setImagePreview("");
    setErrors({});
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
              Edit Subcategory
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
                Subcategory Name *
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
                placeholder="Enter subcategory name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="mainCategory"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Main Category *
              </label>
              <div className="relative">
                <select
                  id="mainCategory"
                  name="mainCategory"
                  value={formData.mainCategory}
                  onChange={handleInputChange}
                  disabled={isFetchingCategories}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors appearance-none bg-white ${
                    errors.mainCategory ? "border-red-500" : "border-gray-300"
                  } ${
                    isFetchingCategories
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  <option value="">
                    {isFetchingCategories
                      ? "Loading..."
                      : "Select main category"}
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category._id || category.id}
                      value={category._id || category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.mainCategory && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.mainCategory}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory Image
              </label>
              <div className="mb-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
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
                    <span className="text-sm text-gray-700">
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </span>
                  </div>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {imagePreview && !formData.image && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current image will be kept if no new image is uploaded
                  </p>
                )}
              </div>
              {errors.image && (
                <p className="mt-2 text-sm text-red-600">{errors.image}</p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="w-full sm:flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || isFetchingCategories}
                className="w-full sm:flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Update Subcategory"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}