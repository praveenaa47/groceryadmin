import React, { useState, useEffect } from "react";
import { X, Upload, Camera, ChevronDown } from "lucide-react";
import { updateCategory, getMainCategories } from "../../api";
import { toast } from "sonner";

export function EditCategoryModal({ isOpen, onClose, onSave, categoryToEdit }) {
  const [formData, setFormData] = useState({
    mainCategory: "",
    name: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mainCategories, setMainCategories] = useState([]);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMainCategories();
      if (categoryToEdit) {
        populateForm();
      }
    }
  }, [isOpen, categoryToEdit]);

  const fetchMainCategories = async () => {
    setIsFetchingCategories(true);
    try {
      const response = await getMainCategories();
      setMainCategories(response.data || response || []);
    } catch (error) {
      console.error("Error fetching main categories:", error);
      toast.error("Failed to fetch main categories");
      setMainCategories([]);
    } finally {
      setIsFetchingCategories(false);
    }
  };
  const populateForm = () => {
    if (categoryToEdit) {
      setFormData({
        mainCategory:
          categoryToEdit.mainCategory?._id || categoryToEdit.mainCategory || "",
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
      newErrors.name = "Category name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("mainCategory", formData.mainCategory);
        formDataToSend.append("name", formData.name);
        if (formData.image) {
          formDataToSend.append("image", formData.image);
        }
        const response = await updateCategory(
          categoryToEdit._id,
          formDataToSend
        );
        toast.success("Category updated successfully");
        console.log("Category updated:", response);        
        if (onSave && response.category) {
          onSave(response.category);
        }

        handleClose();
      } catch (error) {
        console.error("Error updating category:", error);
        toast.error(error.response?.data?.message || "Error updating category");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({ mainCategory: "", name: "", image: null });
    setImagePreview("");
    setErrors({});
    setMainCategories([]);
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
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Edit Category
            </h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4 sm:p-6">
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
                  {mainCategories.map((category) => (
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
            {/* Category Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Image
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
                  "Update Category"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
