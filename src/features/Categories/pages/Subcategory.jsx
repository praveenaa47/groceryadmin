import React, { useState, useEffect } from 'react';
import Button from '../../../Components/ui/Button';
import image1 from '../../../assets/veg1.jpeg';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import DeleteConfirmationModal from '../../../Components/shared/DeleteModal';
import { AddSubcategoryModal } from '../components/Addsubcategory/AddSubcategoryModal';
import InputField from '../../../Components/ui/InputField';
import { EditSubcategoryModal } from '../components/EditSubcategory/EditSubcategoryModal';
import { deleteSubCategory, getAllSubCategory } from '../api';
import { toast, Toaster } from 'sonner';

const Subcategory = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [IsDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllSubCategory();
      
      // Fixed: Preserve the original category data for editing
      const transformedData = response.map((item, index) => ({
        id: item._id,
        image: item.image,
        name: item.name,
        // For display
        category: item.category ? item.category.name : 'No Category',
        // For editing - preserve the full category object and ID
        categoryData: item.category, // Store full category object
        categoryId: item.category ? item.category._id : null, // Store ID separately
        status: item.status ? 'Active' : 'Inactive',
        // Store original item for editing
        originalData: item
      }));
      
      setSubcategories(transformedData);
    } catch (err) {
      setError('Failed to fetch subcategories');
      console.error('Error fetching subcategories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteSubCategory(categoryToDelete.id);
      setSubcategories((prev) =>
        prev.filter((cat) => cat.id !== categoryToDelete.id)
      );
      toast.success("Deleted successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete category";
      toast.error(errorMessage);
      fetchSubcategories();
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleEdit = (item) => {
    console.log("Editing item:", item); 
    setCategoryToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleAddCategory = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveCategory = (categoryData) => {
    fetchSubcategories(); 
    console.log('New category added:', categoryData);
  };


  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sub Category
            </h1>
            <p className="text-gray-600">Manage your product categories</p>
          </div>
          <Button 
            onClick={handleAddCategory}
            icon={Plus}
          >
            Add Sub Category
          </Button>
        </div>
        <div className="max-w-md mb-6">
          <InputField
            type="text"
            placeholder="Search categories..."
            className="w-full rounded-lg pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            icon={<Search className="absolute left-3 top-2.5 text-yellow-500 w-4 h-4" />}
          />
        </div>
        <div>
          <div className="bg-gray-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-5 gap-4 font-semibold text-gray-700 text-center">
              <div>S.NO</div>
              <div>SUBCATEGORY</div>
              <div>MAIN CATEGORY</div>
              <div>STATUS</div>
              <div>ACTION</div>
            </div>
          </div>
          {subcategories.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg">No subcategories found</p>
              <p className="text-gray-400 text-sm mt-2">Click "Add Sub Category" to create your first subcategory</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subcategories.map((item, index) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="grid grid-cols-5 gap-4 items-center">
                    <div className="text-center">
                      <span className="text-sm font-medium text-gray-700">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover mb-3 shadow-sm"
                        onError={(e) => {
                          e.target.src = image1; 
                        }}
                      />
                      <span className="text-sm font-medium text-gray-600 text-center">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium text-gray-700">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                        item.status === 'Active' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex justify-center space-x-3">
                      <Edit
                        className="w-4 h-4 cursor-pointer hover:text-blue-700"
                        onClick={() => handleEdit(item)}
                        color="blue"
                      />
                      <Trash2
                        className="w-4 h-4 cursor-pointer hover:text-red-700"
                        onClick={() => handleDeleteClick(item)}
                        color="red"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <AddSubcategoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveCategory}
        />

        <EditSubcategoryModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCategoryToEdit(null);
          }}
          onSave={(updatedCategory) => {
            fetchSubcategories(); 
            console.log('Subcategory updated:', updatedCategory);
          }}
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

export default Subcategory;