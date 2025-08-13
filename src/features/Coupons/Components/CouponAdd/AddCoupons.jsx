import React, { useState } from 'react';
import { Save, X, Calendar, Tag, Percent, DollarSign, Users, ShoppingCart, Package } from 'lucide-react';

const AddCoupons = ({
  onSave = () => {},
  onCancel = () => {},
  categories = [],
  products = [],
  title = "Add New Coupon"
}) => {
  const defaultCategories = [
    { id: 1, name: "Electronics", icon: "📱" },
    { id: 2, name: "Clothing", icon: "👕" },
    { id: 3, name: "Books", icon: "📚" },
    { id: 4, name: "Home & Garden", icon: "🏠" },
    { id: 5, name: "Sports", icon: "⚽" },
    { id: 6, name: "Beauty", icon: "💄" },
    { id: 7, name: "Food & Beverages", icon: "🍔" },
    { id: 8, name: "All Categories", icon: "🛍️" }
  ];

  const availableCategories = categories.length > 0 ? categories : defaultCategories;

  const defaultProducts = [
    { id: 1, name: "Vegetables", category: "Electronics", price: 999, categoryId: 1 },
    { id: 2, name: "Vegetables", category: "Electronics", price: 899, categoryId: 1 },
    { id: 3, name: "Vegetables", category: "Electronics", price: 1299, categoryId: 1 },
    { id: 4, name: "Vegetables", category: "Clothing", price: 129, categoryId: 2 },
    { id: 5, name: "Vegetables", category: "Clothing", price: 180, categoryId: 2 },
  ];

  const availableProducts = products.length > 0 ? products : defaultProducts;

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    usageLimit: '',
    expiryDate: '',
    status: 'active',
    applicationType: 'category',
    selectedCategories: [],
    selectedProducts: []
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter(id => id !== categoryId)
        : [...prev.selectedCategories, categoryId]
    }));
  };

  const handleProductChange = (productId) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...prev.selectedProducts, productId]
    }));
  };

  const getFilteredProducts = () => {
    if (formData.applicationType === 'product') {
      return availableProducts;
    }
    return [];
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Coupon code is required';
    } else if (formData.code.length < 3) {
      newErrors.code = 'Coupon code must be at least 3 characters';
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = 'Discount value must be greater than 0';
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      newErrors.discountValue = 'Percentage discount cannot exceed 100%';
    }

    if (!formData.usageLimit || formData.usageLimit <= 0) {
      newErrors.usageLimit = 'Usage limit must be greater than 0';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (new Date(formData.expiryDate) <= new Date()) {
      newErrors.expiryDate = 'Expiry date must be in the future';
    }

    if (formData.applicationType === 'category' && formData.selectedCategories.length === 0) {
      newErrors.application = 'Please select at least one category';
    }

    if (formData.applicationType === 'product' && formData.selectedProducts.length === 0) {
      newErrors.application = 'Please select at least one product';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const couponData = {
        ...formData,
        id: Date.now(), 
        usageCount: 0,
        createdAt: new Date().toISOString()
      };
      
      onSave(couponData);
      
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        usageLimit: '',
        expiryDate: '',
        status: 'active',
        applicationType: 'category',
        selectedCategories: [],
        selectedProducts: []
      });
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div >
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
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
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.code ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  {formData.discountType === 'percentage' ? (
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  ) : (
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  )}
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    placeholder={formData.discountType === 'percentage' ? '20' : '50'}
                    min="0"
                    max={formData.discountType === 'percentage' ? '100' : undefined}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.discountValue ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.discountValue && <p className="text-red-500 text-xs mt-1">{errors.discountValue}</p>}
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
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.usageLimit ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.usageLimit && <p className="text-red-500 text-xs mt-1">{errors.usageLimit}</p>}
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
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
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
                    checked={formData.applicationType === 'category'}
                    onChange={handleInputChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">By Category</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="applicationType"
                    value="product"
                    checked={formData.applicationType === 'product'}
                    onChange={handleInputChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">By Products</span>
                </label>
              </div>
            </div>
            {formData.applicationType === 'category' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Categories *
                </label>
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  <div className="space-y-2">
                    {availableCategories.map((category) => (
                      <label
                        key={category.id}
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.selectedCategories.includes(category.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.selectedCategories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                            className="text-blue-600 focus:ring-blue-500 mr-3"
                          />
                          <div className="flex items-center">
                            <span className="text-xl mr-3">{category.icon}</span>
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {formData.applicationType === 'product' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Products *
                </label>
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  <div className="space-y-2">
                    {availableProducts.map((product) => (
                      <label
                        key={product.id}
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.selectedProducts.includes(product.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.selectedProducts.includes(product.id)}
                            onChange={() => handleProductChange(product.id)}
                            className="text-blue-600 focus:ring-blue-500 mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.category}</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-700">₹{product.price}</div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {errors.application && <p className="text-red-500 text-xs mt-2">{errors.application}</p>}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Coupon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCoupons;