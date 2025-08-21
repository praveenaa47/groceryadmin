import React, { useState, useEffect } from "react";
import Button from "../../../Components/ui/Button";
import {
  Edit,
  Pencil,
  Plus,
  PlusIcon,
  Search,
  Trash,
  Trash2,
} from "lucide-react";
import DeleteConfirmationModal from "../../../Components/shared/DeleteModal";
import { AddCategoryModal } from "../components/Addcategory/AddCategoryModal";
import InputField from "../../../Components/ui/InputField";
import { EditCategoryModal } from "../components/EditCategory/EditCategoryModal";
import { deleteCategory, getAllCategory, updateCategory } from "../api";
import { toast, Toaster } from "sonner";

const Category = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategory();
      setCategories(response.data || response || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.mainCategory?.name &&
        category.mainCategory.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteCategory(categoryToDelete._id);
      setCategories((prev) =>
        prev.filter((cat) => cat._id !== categoryToDelete._id)
      );
      toast.success(response.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete category";
      toast.error(errorMessage);
      fetchCategories();
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleEdit = (category) => {
    setIsEditModalOpen(true);
    setCategoryToEdit(category);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCategoryToEdit(null);
  };

  const handleAddCategory = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      await fetchCategories();
      console.log("Categories refreshed after save:", categoryData);
    } catch (error) {
      console.error("Error refreshing categories:", error);
      toast.error("Failed to refresh categories");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Category</h1>
            <p className="text-gray-600">Manage your product categories</p>
          </div>
          <Button onClick={handleAddCategory} icon={PlusIcon}>
            Add Category
          </Button>
        </div>

        <div className="max-w-md mb-6">
          <InputField
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            icon={
              <Search className="absolute left-3 top-2.5 text-yellow-500 w-4 h-4" />
            }
          />
        </div>

        <div className="bg-gray-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-5 gap-4 font-semibold text-gray-700 text-center">
            <div>S.NO</div>
            <div>CATEGORY</div>
            <div>MAIN CATEGORY</div>
            <div>STATUS</div>
            <div>ACTION</div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredCategories.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <p className="text-gray-500">
                {searchTerm
                  ? "No categories found matching your search"
                  : "No categories found"}
              </p>
            </div>
          ) : (
            filteredCategories.map((item, index) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="text-center">{index + 1}</div>
                  <div className="flex flex-col items-center">
                    <img
                      src={item.image || "https://via.placeholder.com/150"}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover mb-3"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-center">
                    {typeof item.mainCategory === "string"
                      ? "Loading..."
                      : item.mainCategory?.name || "N/A"}
                  </div>
                  <div className="text-center">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        item.status
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {item.status ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-center space-x-3">
                    <Edit
                      className="w-4 h-4"
                      onClick={() => handleEdit(item)}
                      color="blue"
                      Edit
                    />
                    <Trash2
                      className="w-4 h-4"
                      onClick={() => handleDeleteClick(item)}
                      color="red"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <AddCategoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveCategory}
        />

        <EditCategoryModal
           isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveCategory}
          categoryToEdit={categoryToEdit}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName="This Record"
        />
        <Toaster position="top-right" richColors />
      </div>
    </>
  );
};

export default Category;
