import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const CarouselAdd = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState({ title: '', image: '' });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({ title: initialData.title, image: initialData.image });
      setImagePreview(initialData.image);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData(prev => ({ ...prev, image: ev.target.result }));
        setImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
      e.target.value = '';
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.image) {
      alert('Please fill in both title and image');
      return;
    }
    onSave(formData);
  };

  return (
<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {initialData ? 'Edit Card' : 'Add New Card'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Enter card title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-blue-50 file:text-blue-700"
            />
          </div>

          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            <Save className="h-4 w-4 mr-2" /> {initialData ? 'Update' : 'Add'} Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarouselAdd;
