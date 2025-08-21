import React from "react";
import { Loader2 } from "lucide-react";

const EditCategoryDropdowns = ({
  mainCategories,
  categories,
  subCategories,
  loadingCategories,
  loadingSubCategories,
  formData,
  handleMainCategoryChange,
  handleCategoryChange,
  handleInputChange,
}) => {
  return (
    <>
      {/* Main Category Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Main Category *
        </label>
        <select
          name="mainCategory"
          value={formData.mainCategory}
          onChange={handleMainCategoryChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">-- Select Main Category --</option>
          {mainCategories.length > 0 &&
            mainCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleCategoryChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!formData.mainCategory || loadingCategories}
          required
        >
          <option value="">
            {loadingCategories
              ? "Loading categories..."
              : !formData.mainCategory
              ? "Select main category first"
              : "-- Select Category --"}
          </option>
          {categories.length > 0 &&
            categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>
        {loadingCategories && (
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <Loader2 className="w-3 h-3 animate-spin mr-1" />
            Loading categories...
          </div>
        )}
      </div>

      {/* Sub Category Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sub Category
        </label>
        <select
          name="subCategory"
          value={formData.subCategory}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!formData.category || loadingSubCategories}
        >
          <option value="">
            {loadingSubCategories
              ? "Loading subcategories..."
              : !formData.category
              ? "Select category first"
              : "-- Select Sub Category --"}
          </option>
          {subCategories.length > 0 &&
            subCategories.map((subCat) => (
              <option key={subCat._id} value={subCat._id}>
                {subCat.name}
              </option>
            ))}
        </select>
        {loadingSubCategories && (
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <Loader2 className="w-3 h-3 animate-spin mr-1" />
            Loading subcategories...
          </div>
        )}
      </div>
    </>
  );
};

export default EditCategoryDropdowns;