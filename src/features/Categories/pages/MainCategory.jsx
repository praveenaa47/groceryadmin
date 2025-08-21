import { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import { AddModal } from "../components/Maincategory/AddModal";
import {
  addMainCategories,
  deleteMainCategories,
  editMainCategories,
  getByIdMainCategories,
  getMainCategories,
} from "../api";
import { toast, Toaster } from "sonner";
import DeleteConfirmationModal from "../../../Components/shared/DeleteModal";
import { EditMainCategory } from "../components/Maincategory/EditMainCategory";

function Button({ onClick, icon: Icon, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors duration-200 ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
}

function InputField({
  type,
  placeholder,
  className = "",
  icon,
  value,
  onChange,
}) {
  return (
    <div className="relative">
      {icon}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className}
      />
    </div>
  );
}

export default function MainCategory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = "https://grocery-codeedx.onrender.com/";
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const filteredCategories = categories.filter((category) =>
    category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMainCategories();

        const transformedData = data.map((item) => ({
          id: item._id,
          name: item.name,
          image: item.image || item.icon,
          primaryColor: item.primaryColor,
          secondaryColor: item.secondaryColor,
          status: item.status,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        setCategories(transformedData);
        console.log("Fetched categories:", transformedData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMainCategories();
  }, []);

  const handleEdit = (id) => {
    setCategoryToEdit(id);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      await deleteMainCategories(categoryToDelete);
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryToDelete)
      );
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      if (error.response) {
        toast.error(
          `Failed to delete category: ${
            error.response.data.message || "Server error"
          }`
        );
      } else {
        toast.error("Failed to delete category. Please try again.");
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };
  const handleAddCategory = () => {
    setIsModalOpen(true);
  };
  const handleSaveCategory = async (categoryData) => {
    try {
      const formData = new FormData();
      formData.append("name", categoryData.name);
      formData.append("primaryColor", categoryData.primaryColor);
      formData.append("secondaryColor", categoryData.secondaryColor);
      if (categoryData.imageFile) {
        formData.append("image", categoryData.imageFile);
      } else if (categoryData.image) {
        formData.append("imageUrl", categoryData.image);
      }

      const response = await addMainCategories(formData);
      const newCategory = {
        id: response._id,
        name: response.name,
        image: response.image,
        primaryColor: response.primaryColor,
        secondaryColor: response.secondaryColor,
        status: response.status,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };

      setCategories((prev) => [...prev, newCategory]);
      toast.success("Category added successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add category:", error);
      toast.dismiss();

      if (error.response) {
        toast.error(
          `Failed to add category: ${
            error.response.data.message || "Server error"
          }`
        );
      } else {
        toast.error("Failed to add category. Please try again.");
      }
    }
  };

  const handleUpdateCategory = async (categoryData) => {
    try {
      const formData = new FormData();
      formData.append("name", categoryData.name);
      formData.append("primaryColor", categoryData.primaryColor);
      formData.append("secondaryColor", categoryData.secondaryColor);
      if (categoryData.imageFile) {
        formData.append("image", categoryData.imageFile);
      } else if (categoryData.image) {
        formData.append("imageUrl", categoryData.image);
      }

      const updated = await editMainCategories(categoryToEdit.id, formData);

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryToEdit.id
            ? {
                ...cat,
                name: updated.name,
                image: updated.image,
                primaryColor: updated.primaryColor,
                secondaryColor: updated.secondaryColor,
              }
            : cat
        )
      );

      toast.success("Category updated successfully!");
      setIsEditModalOpen(false);
      setCategoryToEdit(null);
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error("Failed to update category.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  if (error && categories.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Categories
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Main Category
              </h1>
              <p className="text-gray-600">Manage your product categories</p>
            </div>
            <Button onClick={handleAddCategory} icon={Plus}>
              Add Category
            </Button>
          </div>

          <div className="max-w-md">
            <InputField
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              icon={
                <Search className="absolute left-3 top-2.5 text-yellow-500 w-4 h-4" />
              }
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading categories...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-600">{error}</div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {filteredCategories.map((category) => {
              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 group relative"
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                    <button
                      onClick={() => handleEdit(category)}
                      className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-sm transition-colors duration-200"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category.id)}
                      className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-sm transition-colors duration-200"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-3 bg-gray-100">
                      <img
                        src={
                          category.image
                            ? `${BASE_URL}/uploads/${category.image}`
                            : `https://via.placeholder.com/100x100/f3f4f6/6b7280?text=${
                                category.name?.charAt(0) || ""
                              }`
                        }
                        alt={category.name}
                        className="w-full h-full object-cover"
                        // onError={(e) => {
                        //   e.target.src = `https://via.placeholder.com/100x100/f3f4f6/6b7280?text=${
                        //     category.name?.charAt(0) || ""
                        //   }`;
                        // }}
                      />
                    </div>

                    <h3 className="text-sm font-medium text-gray-800 leading-tight">
                      {category.name}
                    </h3>
                    {(category.primaryColor || category.secondaryColor) && (
                      <div className="flex gap-2 mt-2">
                        {category.primaryColor && (
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: category.primaryColor }}
                            title={`Primary: ${category.primaryColor}`}
                          ></div>
                        )}
                        {category.secondaryColor && (
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: category.secondaryColor }}
                            title={`Secondary: ${category.secondaryColor}`}
                          ></div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {searchTerm
                ? "No categories found matching your search."
                : "No categories available."}
            </div>
            {!searchTerm && (
              <Button onClick={handleAddCategory} icon={Plus}>
                Add Your First Category
              </Button>
            )}
          </div>
        )}
      </div>

      <AddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="This Record"
      />
      <EditMainCategory
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateCategory}
        initialData={categoryToEdit}
      />

      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
