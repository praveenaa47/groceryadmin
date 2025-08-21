import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import CarouselAdd from '../../Pages/CarouselAdd';
import { getCarouselItems, deleteCarouselItems } from '../../api';  // <-- import delete API
import DeleteConfirmationModal from '../../../../Components/shared/DeleteModal';
import { toast, Toaster } from 'sonner';

const CarouselDetails = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // <-- should be boolean
  const [carouselToDelete, setCarouselToDelete] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    fetchCarouselItems();
  }, []);

  const fetchCarouselItems = async () => {
    try {
      setLoading(true);
      const response = await getCarouselItems();
      setCarouselItems(response);
      setError(null);
    } catch (err) {
      setError('Failed to fetch carousel items');
      console.error('Error fetching carousel items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  // open delete modal
  const handleDeleteClick = (carousel) => {
    setCarouselToDelete(carousel);
    setIsDeleteModalOpen(true);
  };

  // confirm delete from modal
  const handleConfirmDelete = async () => {
    if (!carouselToDelete) return;

    try {
      await deleteCarouselItems(carouselToDelete._id);
      setCarouselItems((prev) =>
        prev.filter((item) => item._id !== carouselToDelete._id)
      );
      toast.success("Carousel deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete carousel");
      console.error("Delete error:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setCarouselToDelete(null);
    }
  };

  const handleSave = (item) => {
    if (editingItem) {
      setCarouselItems((prev) =>
        prev.map((i) => (i._id === editingItem._id ? { ...item, _id: editingItem._id } : i))
      );
    } else {
      setCarouselItems((prev) => [...prev, { ...item, _id: Date.now().toString() }]);
    }
    setShowForm(false);
  };

  const toggleImage = (itemId) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === 1 ? 0 : 1,
    }));
  };

  const getCurrentImageUrl = (item) => {
    const currentIndex = currentImageIndex[item._id] || 0;
    const images = [item.image, item.secondaryImage].filter(Boolean);
    if (images.length === 0) return 'https://via.placeholder.com/400x300?text=No+Image';
    return `${images[currentIndex]}`;
  };

  const hasMultipleImages = (item) => {
    return item.image && item.secondaryImage;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading carousel items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <Camera className="h-16 w-16 mx-auto mb-2" />
            <p className="text-lg font-medium">{error}</p>
          </div>
          <button
            onClick={fetchCarouselItems}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200"
          >
            <div className="aspect-video bg-gray-100 relative group">
              <img
                src={getCurrentImageUrl(item)}
                alt={item.title}
                className="w-full h-full object-cover"
              />

              {/* Image navigation for multiple images */}
              {hasMultipleImages(item) && (
                <div className="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => toggleImage(item._id)}
                    className="ml-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleImage(item._id)}
                    className="mr-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Image indicator dots */}
              {hasMultipleImages(item) && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {[0, 1].map((index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        (currentImageIndex[item._id] || 0) === index
                          ? 'bg-white'
                          : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                {item.title}
              </h3>

              {item.products && item.products.length > 0 && (
                <p className="text-sm text-gray-600 mb-3">
                  {item.products.length} product
                  {item.products.length !== 1 ? 's' : ''}
                </p>
              )}

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDeleteClick(item)} // <-- open modal
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {carouselItems.length === 0 && !loading && (
        <div className="text-center py-16">
          <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">
            No carousel cards yet
          </h3>
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="carousel"
      />

      <Toaster position="top-right" richColors />
    </div>
  );
};

export default CarouselDetails;
