import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Camera } from 'lucide-react';
import CarouselAdd from '../../Pages/CarouselAdd';

const CarouselDetails = () => {
  const [carouselItems, setCarouselItems] = useState([
    {
      id: 1,
      title: 'Vegetables',
      image: 'https://wallpapercave.com/wp/wp3104916.jpg'
    },
    {
      id: 2,
      title: 'Vegetables',
      image: 'https://wallpapercave.com/wp/wp3104916.jpg'
    },
    {
      id: 3,
      title: 'Vegetables',
      image: 'https://wallpapercave.com/wp/wp3104916.jpg'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this carousel item?')) {
      setCarouselItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSave = (item) => {
    if (editingItem) {
      // Update existing
      setCarouselItems(prev =>
        prev.map(i => (i.id === editingItem.id ? { ...item, id: editingItem.id } : i))
      );
    } else {
      // Add new
      setCarouselItems(prev => [...prev, { ...item, id: Date.now() }]);
    }
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Carousel Cards</h1>
        <button
          onClick={handleAdd}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          <Plus className="h-5 w-5 mr-2" /> Add Card
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {carouselItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
            <div className="aspect-video bg-gray-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 truncate">{item.title}</h3>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {carouselItems.length === 0 && (
        <div className="text-center py-16">
          <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">No carousel cards yet</h3>
          <p className="text-gray-400 mb-6">Add your first carousel card to get started</p>
          <button
            onClick={handleAdd}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add First Card
          </button>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <CarouselAdd
          initialData={editingItem}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default CarouselDetails;
