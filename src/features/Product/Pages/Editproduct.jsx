import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { getbyCatid, getbyMainid, getMainCategories, updateproduct, viewbyIdproduct } from "../api";
import { toast, Toaster } from "sonner";
import EditImageUploader from "../Components/EditProduct/EditImageUploader";
import EditWeightStockManager from "../Components/EditProduct/EditWeightStockManage";
import EditProductTags from "../Components/EditProduct/EditProductTag";
import EditCategoryDropdowns from "../Components/EditProduct/EditCategoryDropdown";
import { ROUTES } from "../../../lib/constants";

function Editproduct() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mainCategory: "",
    category: "",
    subCategory: "",
    price: "",
    offerPrice: "",
    discountPercentage: 0,
    measurment: "kg",
  });

  const [productFlags, setProductFlags] = useState({
    isAvailable: true,
    isOfferProduct: false,
    isPopular: false,
    isSeasonal: false,
  });

  const [weightsAndStocks, setWeightsAndStocks] = useState([
    { weight: "", measurm: "g", weight_price: "", quantity: "" }
  ]);

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const navigate=useNavigate()

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const product = await viewbyIdproduct(id);
        
        setFormData({
          name: product.name,
          description: product.description,
          mainCategory: product.mainCategory._id,
          category: product.category._id,
          subCategory: product.subCategory._id,
          price: product.price,
          offerPrice: product.offerPrice,
          discountPercentage: product.discountPercentage,
          measurment: product.measurment,
        });
        setProductFlags({
          isAvailable: product.isAvailable,
          isOfferProduct: product.isOfferProduct,
          isPopular: product.isPopular,
          isSeasonal: product.isSeasonal,
        });
        setWeightsAndStocks(product.weightsAndStocks);
        setExistingImages(product.images.map(img => ({ url: img, file: null })));
        if (product.mainCategory._id) {
          const categoriesData = await getbyMainid(product.mainCategory._id);
          setCategories(categoriesData || []);     
          if (product.category._id) {
            const subCategoriesData = await getbyCatid(product.category._id);
            setSubCategories(subCategoriesData || []);
          }
        }

      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product data");
      } finally {
        setLoadingProduct(false);
      }
    };

    const fetchMainCategories = async () => {
      try {
        const data = await getMainCategories();
        setMainCategories(data); 
      } catch (err) {
        console.error("Error fetching main categories:", err);
        toast.error("Failed to load main categories");
      }
    };

    fetchMainCategories();
    fetchProductData();
  }, [id]);

  // Handle main category change
  const handleMainCategoryChange = async (e) => {
    const mainCategoryId = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      mainCategory: mainCategoryId,
      category: "",
      subCategory: ""
    }));

    setCategories([]);
    setSubCategories([]);

    if (mainCategoryId) {
      setLoadingCategories(true);
      try {
        const categoriesData = await getbyMainid(mainCategoryId);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories");
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }
  };

  // Handle category change
  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      category: categoryId,
      subCategory: ""
    }));

    setSubCategories([]);

    if (categoryId) {
      setLoadingSubCategories(true);
      try {
        const subCategoriesData = await getbyCatid(categoryId);
        setSubCategories(subCategoriesData || []);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        toast.error("Failed to load subcategories");
        setSubCategories([]);
      } finally {
        setLoadingSubCategories(false);
      }
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === "offerPrice" || name === "price") {
      const offer = name === "offerPrice" ? parseFloat(value) : parseFloat(formData.offerPrice);
      const original = name === "price" ? parseFloat(value) : parseFloat(formData.price);
      
      if (offer && original && original > offer) {
        const discountPercent = Math.round(((original - offer) / original) * 100 * 100) / 100;
        setFormData(prev => ({
          ...prev,
          discountPercentage: discountPercent,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          discountPercentage: 0,
        }));
      }
    }
  };

  // Toggle product flags
  const toggleProductFlag = (flag) => {
    setProductFlags(prev => ({
      ...prev,
      [flag]: !prev[flag],
    }));
  };

  // Form validation
  const validateForm = () => {
    if (!formData.name.trim()) return "Product name is required";
    if (!formData.mainCategory) return "Main category is required";
    if (!formData.category) return "Category is required";
    if (!formData.price || formData.price <= 0) return "Valid price is required";
    if (!formData.offerPrice || formData.offerPrice <= 0) return "Valid offer price is required";
    if (parseFloat(formData.offerPrice) >= parseFloat(formData.price)) return "Offer price must be less than original price";
    if (images.length === 0 && existingImages.length === 0) return "At least one product image is required";
    
    for (let i = 0; i < weightsAndStocks.length; i++) {
      const item = weightsAndStocks[i];
      if (!item.weight || !item.weight_price || !item.quantity) {
        return `Weight and stock entry ${i + 1} is incomplete`;
      }
    }
    
    return null;
  };

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  const validationError = validateForm();
  if (validationError) {
    setError(validationError);
    return;
  }

  setLoading(true);

  try {
    const formDataToSend = new FormData();
   
    
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    Object.keys(productFlags).forEach(key => {
      formDataToSend.append(key, productFlags[key]);
    });
    
    formDataToSend.append('weightsAndStocks', JSON.stringify(weightsAndStocks));
    
    images.forEach((image, index) => {
      formDataToSend.append('images', image.file);
    });
    
    existingImages.forEach((image, index) => {
      if (image.url && !image.removed) {
        formDataToSend.append('existingImages', image.url);
      }
    });

    await updateproduct(id, formDataToSend);
    
    setSuccess("Product updated successfully!");
    toast.success("Product updated successfully");
    navigate(`${ROUTES.PRODUCT_LIST}`)
    
    setTimeout(() => setSuccess(""), 5000);
  } catch (err) {
    console.error("Error updating product:", err);
    toast.error("Error updating product");
    setError(err.response?.data?.message || "Failed to update product. Please try again.");
  } finally {
    setLoading(false);
  }
};

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-800">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Product
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Main Form Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image Uploader */}
          <div className="lg:col-span-1">
            <EditImageUploader 
              images={images} 
              setImages={setImages} 
              existingImages={existingImages}
              setExistingImages={setExistingImages}
              required 
            />
          </div>

          {/* Right Column - Form Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <EditCategoryDropdowns
                  mainCategories={mainCategories}
                  categories={categories}
                  subCategories={subCategories}
                  loadingCategories={loadingCategories}
                  loadingSubCategories={loadingSubCategories}
                  formData={formData}
                  handleMainCategoryChange={handleMainCategoryChange}
                  handleCategoryChange={handleCategoryChange}
                  handleInputChange={handleInputChange}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Measurement Unit *
                  </label>
                  <select
                    name="measurment"
                    value={formData.measurment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="lb">lb</option>
                    <option value="piece">piece</option>
                    <option value="pack">pack</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your product..."
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="offerPrice"
                    value={formData.offerPrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </div>
            <EditWeightStockManager
              weightsAndStocks={weightsAndStocks}
              setWeightsAndStocks={setWeightsAndStocks}
            />
            <EditProductTags
              productFlags={productFlags}
              toggleProductFlag={toggleProductFlag}
            />
          </div>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default Editproduct;