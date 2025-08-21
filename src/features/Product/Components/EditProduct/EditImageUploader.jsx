import React, { useState } from "react";
import { Upload, X, Image } from "lucide-react";

const EditImageUploader = ({ 
  images, 
  setImages, 
  existingImages = [], 
  setExistingImages,
  required 
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
      isNew: true // Mark as new upload
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    // Check if it's an existing image (has url but no file)
    const isExistingImage = images.some(img => img.id === id && img.url && !img.file);
    
    if (isExistingImage) {
      // Mark existing image as removed rather than deleting it
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, removed: true } : img
      ));
    } else {
      // Remove newly uploaded image
      setImages(prev => prev.filter(img => img.id !== id));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  // Combine existing images with new uploads
  const allImages = [
    ...existingImages.map(img => ({
      ...img,
      id: img.url, // Use URL as ID for existing images
      isExisting: true
    })),
    ...images.filter(img => !img.removed)
  ];

  const displayedImagesCount = allImages.filter(img => !img.removed).length;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        Product Images {required && "*"}
      </h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">
          Drag & drop images here, or click to select
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files)}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Image className="w-4 h-4 mr-2" />
          Choose Files
        </label>
      </div>

      {(displayedImagesCount > 0) && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-700">
            {existingImages.length > 0 ? "All Images" : "Uploaded Images"} ({displayedImagesCount})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {allImages.filter(img => !img.removed).map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt="Product"
                  className="w-full h-20 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
                {image.isExisting && (
                  <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                    Existing
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditImageUploader;