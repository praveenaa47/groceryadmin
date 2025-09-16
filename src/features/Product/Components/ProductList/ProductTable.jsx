import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import DeleteConfirmationModal from "../../../../Components/shared/DeleteModal";
import { useNavigate } from "react-router-dom";
import { deleteproduct, getAllproducts } from "../../api";
import { toast, Toaster } from "sonner";
import { IMG_URL } from "../../../../lib/constants";



const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteProduct, setDeleteproduct] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllproducts();
        setProducts(data);
      } catch (error) {
        setError("Failed to load products");
        toast.error("Failed to load products");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getTotalStock = (weightsAndStocks) => {
    return weightsAndStocks.reduce((total, item) => total + item.quantity, 0);
  };

  const getImageUrl = (images) => {
    if (images && images.length > 0) {
      return `${IMG_URL}/${images[0]}`;
    }
    return "https://via.placeholder.com/80x80";
  };
const handleConfirmDelete = async () => {
  if (!deleteProduct) return;
  try {
    setDeletingId(deleteProduct);
    const res = await deleteproduct(deleteProduct); 
    setProducts((prev) => prev.filter((p) => p._id !== deleteProduct));
    toast.success(res?.message || "Product deleted");
    setIsModalOpen(false);
    setDeleteproduct(false);
  } catch (err) {
    console.error("Delete failed:", err);
    toast.error(err?.response?.data?.message || "Failed to delete product");
  } finally {
    setDeletingId(null);
  }
};
  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteproduct(id);
    setIsModalOpen(true);
  };


  const getStockStatus = (stock) => {
    if (stock <= 10) return "text-red-600 bg-red-50";
    if (stock <= 25) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  const handleRowClick = (id) => {
    navigate(`/productsingle/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product NAME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Weight Options
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => {
                  const totalStock = getTotalStock(product.weightsAndStocks || []);
                  const displayPrice = product.offerPrice || product.price;
                  
                  return (
                    <tr
                      key={product._id}
                      onClick={() => handleRowClick(product._id)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 flex items-center">
                        <img
                          src={getImageUrl(product.images)}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                          // onError={(e) =>
                          //   (e.target.src = "https://via.placeholder.com/80x80")
                          // }
                        />
                        <div className="ml-4">
                          <span className="text-sm font-medium text-gray-900 truncate block">
                            {product.name}
                          </span>
                          <span className="text-xs text-gray-500 truncate block">
                            {product.description}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {product.category?.name}
                          </div>
                          <div className="text-gray-500">
                            {product.subCategory?.name}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <span className="font-semibold text-gray-900">
                            ₹{displayPrice}
                          </span>
                          {product.offerPrice && (
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-500 line-through">
                                ₹{product.price}
                              </span>
                              <span className="text-xs text-green-600 font-medium">
                                {product.discountPercentage}% off
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStockStatus(
                            totalStock
                          )}`}
                        >
                          {totalStock} units
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {product.weightsAndStocks?.map((weight, index) => (
                            <div key={index} className="text-xs text-gray-600">
                              {weight.weight}{weight.measurm} - ₹{weight.weight_price}
                            </div>
                          ))}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          {product.isAvailable && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Available
                            </span>
                          )}
                          {product.isPopular && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Popular
                            </span>
                          )}
                          {product.isOfferProduct && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Offer
                            </span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          onClick={(e) => handleDeleteClick(e, product._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {products.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-2">No products found</p>
              <p className="text-gray-500 text-sm">
                Add your first product to get started
              </p>
            </div>
          )}
        </div>
      </div>
      
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="This Product"
      />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default ProductTable;