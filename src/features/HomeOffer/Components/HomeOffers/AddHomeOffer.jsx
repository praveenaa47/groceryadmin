import React, { useState } from 'react';
import { Upload, X, ChevronDown, Check } from 'lucide-react';

const AddHomeOffer = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    backgroundImage: null,
    gifFile: null,
    selectedProducts: []
  });

  const [errors, setErrors] = useState({});
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  const products = [
    { id: 1, name: 'Red Yummy Potato' },
    { id: 2, name: 'Red Yummy Potato' },
    { id: 3, name: 'Red Yummy Potato' },
    { id: 4, name: 'Red Yummy Potato' },
    { id: 5, name: 'Red Yummy Potato' },
    { id: 6, name: 'Red Yummy Potato' },
    { id: 7, name: 'Red Yummy Potato' },
    { id: 8, name: 'Red Yummy Potato' },
    { id: 9, name: 'Red Yummy Potato' },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.backgroundImage) {
      newErrors.backgroundImage = 'Background image is required';
    }
    
    if (formData.selectedProducts.length === 0) {
      newErrors.selectedProducts = 'At least one product must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fileType]: file
      }));
      
      if (errors[fileType]) {
        setErrors(prev => ({
          ...prev,
          [fileType]: ''
        }));
      }
    }
  };

  const handleProductSelect = (product) => {
    const isSelected = formData.selectedProducts.some(p => p.id === product.id);
    
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        selectedProducts: prev.selectedProducts.filter(p => p.id !== product.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedProducts: [...prev.selectedProducts, product]
      }));
    }
    
    if (errors.selectedProducts) {
      setErrors(prev => ({
        ...prev,
        selectedProducts: ''
      }));
    }
  };

  const removeSelectedProduct = (productId) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter(p => p.id !== productId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      alert('Home offer created successfully!');
    }
  };

  const removeFile = (fileType) => {
    setFormData(prev => ({
      ...prev,
      [fileType]: null
    }));
  };

  return (
 <div className="min-h-screen ">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 ">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter offer title..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="Enter subtitle (optional)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Background Image <span className="text-red-500">*</span>
              </label>
              <div className={`border-2 border-dashed rounded-lg p-3 ${
                errors.backgroundImage ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}>
                {formData.backgroundImage ? (
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <Upload className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700 truncate">{formData.backgroundImage.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('backgroundImage')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <div className="text-xs text-gray-600">
                      <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                        Upload image
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'backgroundImage')}
                        />
                      </label>
                      <span className="text-gray-400"> or drag & drop</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
              {errors.backgroundImage && <p className="text-red-500 text-xs">{errors.backgroundImage}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">GIF File (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3">
                {formData.gifFile ? (
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                        <Upload className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700 truncate">{formData.gifFile.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('gifFile')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <div className="text-xs text-gray-600">
                      <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                        Upload GIF
                        <input
                          type="file"
                          className="hidden"
                          accept="image/gif"
                          onChange={(e) => handleFileUpload(e, 'gifFile')}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">GIF only, up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Products <span className="text-red-500">*</span>
              </label>
              {formData.selectedProducts.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {formData.selectedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center space-x-1"
                    >
                      <span>{product.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSelectedProduct(product.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between text-sm ${
                    errors.selectedProducts ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <span className="text-gray-700">
                    {formData.selectedProducts.length > 0 
                      ? `${formData.selectedProducts.length} products selected`
                      : 'Select products...'
                    }
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                    isProductDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {isProductDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {products.map((product) => {
                      const isSelected = formData.selectedProducts.some(p => p.id === product.id);
                      return (
                        <div
                          key={product.id}
                          onClick={() => handleProductSelect(product)}
                          className={`px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between text-sm ${
                            isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          }`}
                        >
                          <span>{product.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {errors.selectedProducts && <p className="text-red-500 text-xs">{errors.selectedProducts}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2  text-white rounded-lg bg-blue-500 text-sm font-medium shadow-md "
              >
                Create Offer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHomeOffer;