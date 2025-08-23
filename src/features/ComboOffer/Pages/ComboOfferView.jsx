// ComboOfferView.jsx (updated version with category management)
import { useState, useEffect } from "react";
import { Plus, Eye, Grid3X3 } from "lucide-react";
import {
  getComboOffer,
  addComboOffer,
  deleteComboOffer,
  getbyIdComboOffer,
  updateComboOffer,
  offerCategoryget,
  offerCategorycreate,
} from "../api";
import { getAllproducts } from "../../Product/api";
import { toast, Toaster } from "sonner";
import ComboOfferList from "../Components/ComboOfferInfo/ComboOfferList";
import ComboOfferModal from "../Components/ComboOfferInfo/ComboOfferModal";
import DeleteConfirmationModal from "../../../Components/shared/DeleteModal";

const ComboOfferView = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showViewCategoriesModal, setShowViewCategoriesModal] = useState(false);
  const [comboOffers, setComboOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [comboToDelete, setComboToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    image: null,
    products: [],
    discountType: "fixed",
    discountValue: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  // Category form state
  const [categoryFormData, setCategoryFormData] = useState({
    title: "",
    status: true,
  });

  const [categories, setCategories] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);

  // Fetch combo offers and other data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getComboOffer();
        setComboOffers(data);
      } catch (error) {
        console.error("Failed to load combo offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const productsResponse = await getAllproducts();
        setAvailableProducts(productsResponse);
      } catch (error) {
        console.error("Failed to load products:", error);
        setAvailableProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await offerCategoryget();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleDeleteClick = (combo) => {
    setComboToDelete(combo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!comboToDelete?._id) return;

    setIsDeleting(true);
    try {
      await deleteComboOffer(comboToDelete._id);
      setComboOffers((prev) => prev.filter((c) => c._id !== comboToDelete._id));
      toast.success("Combo offer deleted");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete combo offer";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setComboToDelete(null);
    }
  };

  const handleEdit = async (id) => {
    try {
      const data = await getbyIdComboOffer(id);

      // Prefill form
      setFormData({
        name: data.name || "",
        category: data.category?._id || "",
        image: null,
        products: data.products || [],
        discountType: data.discountType || "fixed",
        discountValue: data.discountValue || "",
        startDate: data.startDate ? data.startDate.split("T")[0] : "",
        endDate: data.endDate ? data.endDate.split("T")[0] : "",
        isActive: data.isActive ?? true,
      });

      setEditingId(id);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to fetch combo offer by ID:", error);
      toast.error("Failed to load combo details for editing");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setCreating(true);

      // Process products data before sending
      const processedProducts = formData.products.map((product) => {
        const { selectedWeight, weightPrice, availableStock, ...rest } = product;
        
        // Clean the product object and ensure all required fields are present
        return {
          productId: rest.productId,
          weight: rest.weight || "1",
          measurm: rest.measurm || "piece",
          quantity: rest.quantity || 1,
          selectedWeightPrice: weightPrice || 0,
        };
      });

      // Validate that we have products
      if (!processedProducts || processedProducts.length === 0) {
        toast.error("Please add at least one product to the combo offer");
        return;
      }

      // Check if we're uploading an image or sending JSON data
      let requestData;
      const hasImage = formData.image && formData.image instanceof File;

      if (hasImage) {
        // Use FormData for file upload
        const formDataObj = new FormData();
        formDataObj.append("name", formData.name);
        formDataObj.append("category", formData.category);
        formDataObj.append("discountType", formData.discountType);
        formDataObj.append("discountValue", formData.discountValue);
        formDataObj.append("startDate", formData.startDate);
        formDataObj.append("endDate", formData.endDate);
        formDataObj.append("isActive", formData.isActive);
        formDataObj.append("image", formData.image);
        
        // Append each product individually to FormData
        processedProducts.forEach((product, index) => {
          formDataObj.append(`products[${index}][productId]`, product.productId);
          formDataObj.append(`products[${index}][weight]`, product.weight);
          formDataObj.append(`products[${index}][measurm]`, product.measurm);
          formDataObj.append(`products[${index}][quantity]`, product.quantity);
          if (product.selectedWeightPrice) {
            formDataObj.append(`products[${index}][selectedWeightPrice]`, product.selectedWeightPrice);
          }
        });
        
        requestData = formDataObj;
      } else {
        // Use regular JSON object (no file upload)
        requestData = {
          name: formData.name,
          category: formData.category,
          discountType: formData.discountType,
          discountValue: formData.discountValue,
          startDate: formData.startDate,
          endDate: formData.endDate,
          isActive: formData.isActive,
          products: processedProducts,
        };
      }

      let response;
      if (editingId) {
        response = await updateComboOffer(editingId, requestData);
        toast.success(response.message || "Combo offer updated successfully!");
      } else {
        response = await addComboOffer(requestData);
        toast.success(response.message || "Combo offer created successfully!");
      }

      // Refresh list
      refreshData();
      resetForm();
      setShowModal(false);
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save combo offer:", error);
      
      // Extract error message from response
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.error || 
                          "Failed to save combo offer. Please try again.";
      
      toast.error(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  // Handle category creation
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    
    if (!categoryFormData.title.trim()) {
      toast.error("Please enter a category title");
      return;
    }

    try {
      setCreatingCategory(true);
      const response = await offerCategorycreate(categoryFormData);
      toast.success(response.message || "Category created successfully!");
      
      // Refresh categories list
      await fetchCategories();
      
      // Reset form and close modal
      setCategoryFormData({
        title: "",
        status: true,
      });
      setShowCategoryModal(false);
    } catch (error) {
      console.error("Failed to create category:", error);
      const errorMessage = error?.response?.data?.message || 
                          "Failed to create category. Please try again.";
      toast.error(errorMessage);
    } finally {
      setCreatingCategory(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      image: null,
      products: [],
      discountType: "fixed",
      discountValue: "",
      startDate: "",
      endDate: "",
      isActive: true,
    });
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const data = await getComboOffer();
      setComboOffers(data);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setCategoryFormData({
      title: "",
      status: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Combo Offers</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowViewCategoriesModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-lg"
            >
              <Eye className="w-5 h-5" />
              View Categories
            </button>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-lg"
            >
              <Grid3X3 className="w-5 h-5" />
              Add Category
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Combo Offer
            </button>
          </div>
        </div>

        <ComboOfferList
          comboOffers={comboOffers}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onAddNew={() => setShowModal(true)}
        />
      </div>
      <ComboOfferModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isEditing={!!editingId}
        loading={creating}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        availableProducts={availableProducts}
        productsLoading={productsLoading}
      />
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Category</h2>
            <form onSubmit={handleCategorySubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Title *
                </label>
                <input
                  type="text"
                  value={categoryFormData.title}
                  onChange={(e) => setCategoryFormData({...categoryFormData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category title"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={categoryFormData.status}
                    onChange={(e) => setCategoryFormData({...categoryFormData, status: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active Status</span>
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseCategoryModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {creatingCategory ? "Creating..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showViewCategoriesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Combo Categories</h2>
              <button
                onClick={() => setShowViewCategoriesModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {categories.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No categories found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <div key={category._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{category.title}</h3>
                          <p className={`text-sm ${category.status ? 'text-green-600' : 'text-red-600'}`}>
                            {category.status ? 'Active' : 'Inactive'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Created: {new Date(category.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          category.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {category.status ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowViewCategoriesModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" richColors />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="This Record"
      />
    </div>
  );
};

export default ComboOfferView;