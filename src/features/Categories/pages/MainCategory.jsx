import { useState } from "react";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import { AddModal } from "../components/Maincategory/AddModal";

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
function InputField({ type, placeholder, className = "", icon, value, onChange }) {
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
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Fruits",
      image:
        "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 2,
      name: "Bread",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 3,
      name: "Vegetable",
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 4,
      name: "Fish",
      image:
        "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 5,
      name: "Meat",
      image:
        "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 6,
      name: "Drinks",
      image:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 7,
      name: "Sea Food",
      image:
        "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 8,
      name: "Ice cream",
      image:
        "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 9,
      name: "Juice",
      image:
        "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 10,
      name: "Jam",
      image:
        "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=100&h=100&fit=crop&crop=center",
    },
  ]);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (categoryId) => {
    console.log("Edit category:", categoryId);
    alert(`Edit category with ID: ${categoryId}`);
  };

  const handleDelete = (categoryId) => {
    console.log("Delete category:", categoryId);
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    }
  };

  const handleAddCategory = () => {
    setIsModalOpen(true);
  };
  const handleSaveCategory = (categoryData) => {
    setCategories(prev => [...prev, categoryData]);
    console.log('New category added:', categoryData);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

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
            <Button 
            onClick={handleAddCategory}
             icon={Plus}>
              Add Category
            </Button>
          </div>
          
          {/* Search Input */}
          <div className="max-w-md">
            <InputField
              type="text"
              placeholder="Search categories..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              icon={<Search className="absolute left-3 top-2.5 text-yellow-500 w-4 h-4" />}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {filteredCategories.map((category) => {
            return (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 group relative"
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                  <button
                    onClick={() => handleEdit(category.id)}
                    className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-sm transition-colors duration-200"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-sm transition-colors duration-200"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-3 bg-gray-100">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/100x100/f3f4f6/6b7280?text=${category.name.charAt(
                          0
                        )}`;
                      }}
                    />
                  </div>

                  <h3 className="text-sm font-medium text-gray-800 leading-tight">
                    {category.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

      </div>
       <AddModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCategory}
        />
    </div>
  );
}