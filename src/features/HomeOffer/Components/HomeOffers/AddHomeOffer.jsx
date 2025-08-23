import React, { useState } from 'react';
import { Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { addHomeoffer } from '../../api';
import { toast, Toaster } from 'sonner';


const AddHomeOffer = () => {
  const [formData, setFormData] = useState({
    backgroundImage: null,
    gifFile: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.backgroundImage) {
      newErrors.backgroundImage = 'Background image is required';
    }
    
    if (!formData.gifFile) {
      newErrors.gifFile = 'GIF file is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (fileType === 'gifFile' && !file.type.includes('gif')) {
        setErrors(prev => ({
          ...prev,
          [fileType]: 'Please select a valid GIF file'
        }));
        return;
      }
      
      if (fileType === 'backgroundImage' && !file.type.includes('image')) {
        setErrors(prev => ({
          ...prev,
          [fileType]: 'Please select a valid image file'
        }));
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [fileType]: 'File size must be less than 10MB'
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        [fileType]: file
      }));
      
      if (errors[fileType]) {
        setErrors(prev => ({
          ...prev,
          [fileType]: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append('backgroundImage', formData.backgroundImage);
      formDataToSend.append('gif', formData.gifFile);
      const response = await addHomeoffer(formDataToSend);
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', {
        backgroundImage: formData.backgroundImage.name,
        gif: formData.gifFile.name
      });
      
      setSubmitStatus('success');
      toast.success("successfully added")
      setTimeout(() => {
        setFormData({
          backgroundImage: null,
          gifFile: null
        });
        setSubmitStatus(null);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to create home offer:', error);
      toast.error('Failed to create home offer:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = (fileType) => {
    setFormData(prev => ({
      ...prev,
      [fileType]: null
    }));
    
    if (errors[fileType]) {
      setErrors(prev => ({
        ...prev,
        [fileType]: ''
      }));
    }
  };

  const renderFileUpload = (fileType, label, acceptedTypes, isRequired = false) => {
    const file = formData[fileType];
    const error = errors[fileType];
    
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <div className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
        }`}>
          {file ? (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  fileType === 'gifFile' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <Upload className={`w-5 h-5 ${
                    fileType === 'gifFile' ? 'text-green-600' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900 block">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(fileType)}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <div className="text-sm text-gray-600">
                <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                  Click to upload {label.toLowerCase()}
                  <input
                    type="file"
                    className="hidden"
                    accept={acceptedTypes}
                    onChange={(e) => handleFileUpload(e, fileType)}
                  />
                </label>
                <span className="text-gray-400"> or drag & drop</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {fileType === 'gifFile' ? 'GIF files only' : 'PNG, JPG, GIF'}, up to 10MB
              </p>
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-sm flex items-center mt-1">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Add Home Offer</h2>
            <p className="text-sm text-gray-600 mt-1">Upload background image and GIF for the home carousel</p>
          </div>
          
          <div className="p-6 space-y-6">
            {renderFileUpload('backgroundImage', 'Background Image', 'image/*', true)}
            {renderFileUpload('gifFile', 'GIF File', 'image/gif', true)}

            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="text-green-800 font-medium">Home offer created successfully!</p>
                  <p className="text-green-600 text-sm">Your carousel has been uploaded and is now active.</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <p className="text-red-800 font-medium">Failed to create home offer</p>
                  <p className="text-red-600 text-sm">Please try again or contact support if the issue persists.</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || (!formData.backgroundImage || !formData.gifFile)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Offer'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster position='top-right' richColors />
    </div>
  );
};

export default AddHomeOffer;