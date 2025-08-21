import React, { useState } from "react";
import { Save, X, Package, Camera, Calendar, Clock, IndianRupeeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditDeal = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    offerPrice: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const products = [
    { name: "Fresh Tomatoes (1 kg)", originalPrice: 3.99 },
    { name: "Onions (1 kg)", originalPrice: 2.49 },
    { name: "Potatoes (1 kg)", originalPrice: 2.99 },
    { name: "Carrots (500g)", originalPrice: 1.99 },
    { name: "Green Beans (500g)", originalPrice: 2.79 },
    { name: "Bell Peppers (500g)", originalPrice: 3.49 },
    { name: "Spinach (250g)", originalPrice: 2.29 },
  ];

  const handleCancel = () => {
    navigate("/dealpage");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName) newErrors.productName = "Product is required";
    if (!formData.offerPrice || parseFloat(formData.offerPrice) <= 0)
      newErrors.offerPrice = "Valid offer price required";

    const selectedProduct = products.find((p) => p.name === formData.productName);
    if (selectedProduct && parseFloat(formData.offerPrice) >= selectedProduct.originalPrice) {
      newErrors.offerPrice = "Offer price must be less than original price";
    }

    if (!formData.startDate) newErrors.startDate = "Start date required";
    if (!formData.endDate) newErrors.endDate = "End date required";
    if (!formData.startTime) newErrors.startTime = "Start time required";
    if (!formData.endTime) newErrors.endTime = "End time required";

    if (formData.startDate && formData.endDate && formData.startTime && formData.endTime) {
      const start = new Date(`${formData.startDate}T${formData.startTime}`);
      const end = new Date(`${formData.endDate}T${formData.endTime}`);
      if (end <= start) {
        newErrors.endDate = "End date/time must be after start date/time";
        newErrors.endTime = "End time must be after start time";
      }
    }

    if (!formData.image) newErrors.image = "Product image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    console.log("Deal Added:", formData);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/dealpage");
    }, 1000);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image must be < 5MB" });
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, image: "Select a valid image file" });
        return;
      }
      setFormData({ ...formData, image: file });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit deal</h1>

      <div className="space-y-6">
        {/* Product */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Package className="w-5 h-5" /> Product Information
          </h2>
          <select
            value={formData.productName}
            onChange={(e) => handleInputChange("productName", e.target.value)}
            className={`w-full p-3 border rounded-lg ${
              errors.productName ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Choose a product</option>
            {products.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name} - ₹{p.originalPrice.toFixed(2)}
              </option>
            ))}
          </select>
          {errors.productName && <p className="text-red-500 text-sm">{errors.productName}</p>}
        </div>

        {/* Image */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Camera className="w-5 h-5" /> Product Image
          </h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={`w-full p-3 border rounded-lg ${
              errors.image ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
        </div>

        {/* Dates */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" /> Deal Duration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              className={`p-3 border rounded-lg ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              className={`p-3 border rounded-lg ${
                errors.endDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
              className={`p-3 border rounded-lg ${
                errors.startTime ? "border-red-500" : "border-gray-300"
              }`}
            />
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange("endTime", e.target.value)}
              className={`p-3 border rounded-lg ${
                errors.endTime ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
        </div>

        {/* Price */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <IndianRupeeIcon className="w-5 h-5" /> Pricing
          </h2>
          <input
            type="number"
            step="0.01"
            value={formData.offerPrice}
            onChange={(e) => handleInputChange("offerPrice", e.target.value)}
            placeholder="Offer Price (₹)"
            className={`w-full p-3 border rounded-lg ${
              errors.offerPrice ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.offerPrice && <p className="text-red-500 text-sm">{errors.offerPrice}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            className="px-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : <><Save className="w-4 h-4" /> Add Deal</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDeal;
