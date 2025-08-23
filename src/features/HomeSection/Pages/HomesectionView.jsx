import { useEffect, useState } from "react";
import { Plus, Package, Edit, Trash2, ChevronDown } from "lucide-react";
import { getAllproducts } from "../../Product/api";
import { addHome, deleteHome, getHome, updateHome } from "../api";
import { toast, Toaster } from "sonner";
import DeleteConfirmationModal from "../../../Components/shared/DeleteModal";

export default function HomeSectionView() {
  const [sections, setSections] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSection, setNewSection] = useState({ title: "", products: [] });
  const [selectedProduct, setSelectedProduct] = useState("");
  const [addingSection, setAddingSection] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [homesectonToDelete, setHomesectonToDelete] = useState("");
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editSection, setEditSection] = useState({ title: "", products: [] });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editSelectedProduct, setEditSelectedProduct] = useState("");

  // Helpers
  const namesToIds = (names) => {
    return names
      .map((name) => {
        const p = products.find((x) => x.name === name);
        return p ? p._id || p.id : null;
      })
      .filter(Boolean);
  };

  useEffect(() => {
    const fetchHomeSections = async () => {
      setSectionsLoading(true);
      try {
        const response = await getHome();
        const transformedSections = response.map((section) => ({
          id: section._id,
          title: section.title,
          // store names for display
          products: (section.products || []).map((p) => p.name),
          _id: section._id,
          createdAt: section.createdAt,
          updatedAt: section.updatedAt,
        }));
        setSections(transformedSections);
      } catch (error) {
        console.error("Failed to get home sections:", error);
        setError("Failed to load home sections");
      } finally {
        setSectionsLoading(false);
      }
    };
    fetchHomeSections();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getAllproducts();
        setProducts(response);
      } catch (error) {
        console.error("Failed to get products:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddSection = async () => {
    if (newSection.title && newSection.products.length > 0) {
      setAddingSection(true);
      setError("");
      try {
        const productIds = namesToIds(newSection.products);
        const requestBody = {
          title: newSection.title,
          products: productIds,
        };

        const response = await addHome(requestBody);
        const newSectionData = {
          id: response.section._id,
          title: response.section.title,
          products: (response.section.products || []).map((p) => p.name),
          _id: response.section._id,
          createdAt: response.section.createdAt,
          updatedAt: response.section.updatedAt,
        };

        setSections((prev) => [...prev, newSectionData]);
        setNewSection({ title: "", products: [] });
        setSelectedProduct("");
        setShowAddForm(false);
        toast.success("Added SUCCESSFULLY");
        console.log("Section created successfully:", response.message);
      } catch (error) {
        console.error("Failed to create home section:", error);
        toast.error("Failed to create section. Please try again.");
      } finally {
        setAddingSection(false);
      }
    }
  };

  const handleAddProduct = () => {
    if (selectedProduct && !newSection.products.includes(selectedProduct)) {
      setNewSection({
        ...newSection,
        products: [...newSection.products, selectedProduct],
      });
      setSelectedProduct("");
    }
  };

  const handleDeleteClick = (item) => {
    setHomesectonToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleRemoveProduct = (index) => {
    setNewSection({
      ...newSection,
      products: newSection.products.filter((_, i) => i !== index),
    });
  };
  
  const handleConfirmDelete = async () => {
    if (!homesectonToDelete) return;

    setIsDeleting(true);
    try {
      await deleteHome(homesectonToDelete.id);
      setSections((prev) => prev.filter((s) => s.id !== homesectonToDelete.id));
      toast.success("Deleted successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete home";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setHomesectonToDelete(null);
    }
  };

  const startEdit = (section) => {
    setEditingSectionId(section.id);
    setEditSection({
      title: section.title,
      products: section.products ? [...section.products] : [],
    });
    setEditSelectedProduct("");
  };

  const cancelEdit = () => {
    setEditingSectionId(null);
    setEditSection({ title: "", products: [] });
    setEditSelectedProduct("");
    setSavingEdit(false);
  };

  const addProductToEdit = () => {
    if (
      editSelectedProduct &&
      !editSection.products.includes(editSelectedProduct)
    ) {
      setEditSection((prev) => ({
        ...prev,
        products: [...prev.products, editSelectedProduct],
      }));
      setEditSelectedProduct("");
    }
  };

  const removeProductFromEdit = (index) => {
    setEditSection((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const saveEdit = async () => {
    if (!editingSectionId) return;
    if (!editSection.title || editSection.products.length === 0) {
      toast.error("Please provide a title and at least one product.");
      return;
    }
    try {
      setSavingEdit(true);

      const productIds = namesToIds(editSection.products);
      const reqBody = { title: editSection.title, products: productIds };
      const res = await updateHome(editingSectionId, reqBody);
      const updated = {
        id: res.section._id,
        title: res.section.title,
        products: (res.section.products || []).map((p) => p.name),
        _id: res.section._id,
        createdAt: res.section.createdAt,
        updatedAt: res.section.updatedAt,
      };

      setSections((prev) =>
        prev.map((s) => (s.id === editingSectionId ? updated : s))
      );
      toast.success("Section updated successfully");
      cancelEdit();
    } catch (err) {
      console.error("Failed to update home section:", err);
      toast.error("Failed to update section. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  };

  if (sectionsLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading home sections...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Home-Section</h1>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Section
        </button>
      </div>

      {/* Add Section Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add New Section
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={newSection.title}
                onChange={(e) =>
                  setNewSection({ ...newSection, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter section title"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Products
            </label>

            {error && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-8"
                  disabled={loading || products.length === 0}
                >
                  <option value="">
                    {loading ? "Loading products..." : "Select a product"}
                  </option>
                  {products.map((product) => (
                    <option
                      key={product._id || product.id}
                      value={product.name}
                      disabled={newSection.products.includes(product.name)}
                    >
                      {product.name}
                      {newSection.products.includes(product.name)
                        ? " (Already added)"
                        : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={handleAddProduct}
                disabled={!selectedProduct || loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {newSection.products.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {newSection.products.map((product, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {product}
                    <button
                      onClick={() => handleRemoveProduct(index)}
                      className="text-blue-600 hover:text-blue-800 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {products.length === 0 && !loading && (
              <p className="text-gray-500 text-sm mt-2">
                No products available. Please add products first.
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddSection}
              disabled={
                !newSection.title ||
                newSection.products.length === 0 ||
                addingSection
              }
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
            >
              {addingSection ? "Creating..." : "Add Section"}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewSection({ title: "", products: [] });
                setSelectedProduct("");
                setError("");
              }}
              disabled={addingSection}
              className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-700 px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sections List */}
      <div className="grid gap-6">
        {sections.map((section) => {
          const isEditing = editingSectionId === section.id;

          return (
            <div
              key={section.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {isEditing ? "Editing: " : ""}
                      {isEditing ? editSection.title : section.title}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    {!isEditing && (
                      <button
                        onClick={() => startEdit(section)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {!isEditing && (
                      <button
                        onClick={() => handleDeleteClick(section)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Normal view */}
                {!isEditing && (
                  <div>
                    {section.products && section.products.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {section.products.map((product, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No products added</p>
                    )}
                  </div>
                )}

                {/* Edit view */}
                {isEditing && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editSection.title}
                          onChange={(e) =>
                            setEditSection((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter section title"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Products
                      </label>

                      <div className="flex gap-2 mb-3">
                        <div className="flex-1 relative">
                          <select
                            value={editSelectedProduct}
                            onChange={(e) =>
                              setEditSelectedProduct(e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-8"
                            disabled={loading || products.length === 0}
                          >
                            <option value="">
                              {loading
                                ? "Loading products..."
                                : "Select a product"}
                            </option>
                            {products.map((product) => (
                              <option
                                key={product._id || product.id}
                                value={product.name}
                                disabled={editSection.products.includes(
                                  product.name
                                )}
                              >
                                {product.name}
                                {editSection.products.includes(product.name)
                                  ? " (Already added)"
                                  : ""}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <button
                          onClick={addProductToEdit}
                          disabled={!editSelectedProduct || loading}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {editSection.products.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {editSection.products.map((product, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                            >
                              {product}
                              <button
                                onClick={() => removeProductFromEdit(index)}
                                className="text-blue-600 hover:text-blue-800 ml-1"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {products.length === 0 && !loading && (
                        <p className="text-gray-500 text-sm mt-2">
                          No products available. Please add products first.
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={saveEdit}
                        disabled={
                          !editSection.title ||
                          editSection.products.length === 0 ||
                          savingEdit
                        }
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        {savingEdit ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={savingEdit}
                        className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-700 px-6 py-2 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {sections.length === 0 && !showAddForm && !sectionsLoading && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No sections yet
          </h3>
        </div>
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="This Record"
      />
      <Toaster position="top-right" richColors />
    </div>
  );
}
