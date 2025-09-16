import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertCircle,
  Edit,
  Trash,
  Star,
  Package,
  Weight,
  Calendar,
  DollarSign,
  Percent,
  Layers,
  Tag
} from "lucide-react";
import { useParams,useNavigate } from "react-router-dom";
import { viewbyIdproduct } from "../api";
import { IMG_URL } from "../../../lib/constants";

function ProductSingleView() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams(); 

  const navigate = useNavigate()
const handleButton = () => {
  navigate(`/editproduct/${id}`, { state: { product } }); 
};

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await viewbyIdproduct(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);


  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600">The requested product could not be found.</p>
        </div>
      </div>
    );
  }

  const imageBaseUrl =  ""; 
  const productImages = product.images?.map(img => `${IMG_URL}/${img}`) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Product Details
              </h1>
              <p className="text-sm text-gray-600">Product ID: {product._id}</p>
            </div>
            <div className="flex items-center space-x-2 gap-3">
              {product.isAvailable ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Available
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Unavailable
                </span>
              )}
               <button
                          onClick={handleButton}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Product Images</h2>
              {productImages.length > 0 ? (
                <>
                  <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
                    <img
                      src={productImages[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/500x500?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="flex space-x-2 overflow-x-auto">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? "border-blue-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt=""
                          className="w-full h-full object-cover"
                          // onError={(e) => {
                          //   e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
                          // }}
                        />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No images available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Layers className="w-5 h-5 mr-2" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <p className="text-gray-900 font-medium">{product.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <p className="text-gray-900">{product.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Main Category
                  </label>
                  <p className="text-gray-900">{product.mainCategory?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <p className="text-gray-900">{product.category?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Category
                  </label>
                  <p className="text-gray-900">{product.subCategory?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Measurement
                  </label>
                  <p className="text-gray-900 flex items-center">
                    <Weight className="w-4 h-4 mr-1" />
                    {product.measurment}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created At
                  </label>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Pricing & Inventory
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Price
                  </label>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{product.offerPrice}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price
                  </label>
                  <p className="text-lg text-gray-500 line-through">
                    ₹{product.price}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount
                  </label>
                  <p className="text-lg text-red-600 flex items-center">
                    <Percent className="w-4 h-4 mr-1" />
                    {product.discountPercentage}% OFF
                  </p>
                </div>
              </div>

              {/* Weights and Stocks */}
              {product.weightsAndStocks?.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold mb-3 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Available Weights & Stock
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.weightsAndStocks.map((stock, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">
                            {stock.weight} {stock.measurm}
                          </span>
                          <span className="text-lg font-bold text-blue-600">
                            ₹{stock.weight_price}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Stock:</span>
                          <span className={`font-medium ${
                            stock.quantity > 10 ? 'text-green-600' : 
                            stock.quantity > 0 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {stock.quantity} units
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Tags/Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Product Status & Tags
              </h2>
              <div className="flex flex-wrap gap-3">
                {product.isAvailable && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Available
                  </span>
                )}
                {product.isOfferProduct && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    Offer Product
                  </span>
                )}
                {product.isPopular && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-600 text-sm font-medium rounded-full flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </span>
                )}
                {product.isSeasonal && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                    Seasonal Product
                  </span>
                )}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <p className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Updated:</span>
                    <p className="font-medium">{new Date(product.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSingleView;