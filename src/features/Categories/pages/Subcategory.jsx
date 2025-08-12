import React, { useState } from 'react';
import Button from '../../../Components/ui/Button';
import image1 from '../../../assets/veg1.jpeg';
import image2 from '../../../assets/veg2.jpeg';
import image3 from '../../../assets/veg3.jpeg';
import { Plus, Search } from 'lucide-react';
import DeleteConfirmationModal from '../../../Components/shared/DeleteModal';
import { AddSubcategoryModal } from '../components/Addsubcategory/AddSubcategoryModal';
import InputField from '../../../Components/ui/InputField';

const Subcategory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  const [subcategories, setSubcategories] = useState([
    {
      id: 1,
      image: image1,
      name: 'KURTHI ALINE',
      category: 'Tomato',
      status: 'Active'
    },
    {
      id: 2,
      image: image2,
      name: 'SLITED',
      category: 'Potato',
      status: 'Active'
    },
    {
      id: 3,
      image: image3,
      name: 'DRESS',
      category: 'Onion',
      status: 'Active'
    }
  ]);
  const handleDeleteClick = (id) => {
    setCategoryToDelete(id);
    setIsModalOpen(true);
  };
  const handleConfirmDelete = () => {
    console.log('Delete confirmed for category ID:', categoryToDelete);
    setIsModalOpen(false);
  }

  const handleEdit = (id) => {
    console.log('Edit item:', id);
  };
  const handleAddCategory = () => {
    setIsAddModalOpen(true);
  };

const handleSaveCategory = (categoryData) => {
  const newCategory = {
    id: subcategories.length + 1,
    image: categoryData.image || image1, 
    name: categoryData.name || 'Untitled',
    category: categoryData.category || 'Uncategorized',
    status: categoryData.status || 'Active'
  };

  setSubcategories((prev) => [...prev, newCategory]);
  console.log('New category added:', newCategory);
};


  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header with Add Button on Right */}
       <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Sub Category
                    </h1>
                    <p className="text-gray-600">Manage your product categories</p>
                  </div>
                  <Button 
                  onClick={handleAddCategory}
                   icon={Plus}>
                    Add Sub Category
                  </Button>
                </div>
                <div className="max-w-md">
            <InputField
              type="text"
              placeholder="Search categories..."
              className="w-full  rounded-lg  pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              icon={<Search className="absolute left-3 top-2.5 text-yellow-500 w-4 h-4" />}
            />
          </div>
        
        <div>
          {/* Table Header */}
          <div className="bg-gray-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-5 gap-4 font-semibold text-gray-700 text-center">
              <div>S.NO</div>
              <div>SUBCATEGORY</div>
              <div>MAIN CATEGORY</div>
              <div>STATUS</div>
              <div>ACTION</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="space-y-4">
            {subcategories.map((item, index) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-5 gap-4 items-center">
                  {/* Serial Number Column */}
                  <div className="text-center">
                    <span className="text-sm font-medium text-gray-700">
                      {index + 1}
                    </span>
                  </div>

                  {/* Sub Category Column */}
                  <div className="flex flex-col items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover mb-3 shadow-sm"
                    />
                    <span className="text-sm font-medium text-gray-600 text-center">
                      {item.name}
                    </span>
                  </div>

                  {/* Category Column */}
                  <div className="text-center">
                    <span className="text-sm font-medium text-gray-700">
                      {item.category}
                    </span>
                  </div>

                  {/* Status Column */}
                  <div className="text-center">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-500 text-white">
                      {item.status}
                    </span>
                  </div>

                  {/* Action Column */}
                  <div className="flex justify-center space-x-3">
                    <Button
                      onClick={() => handleEdit(item.id)}
                      variant='neutral'
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(item.id)}
                      variant='danger'
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>      
        </div>
        <AddSubcategoryModal
         isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveCategory}
        />
          
        
        <DeleteConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName="This Record"
        />
      </div>
    </>
  );
};

export default Subcategory ;