import React, { useEffect, useState } from "react";
import {
  Save,
  X,
  Package,
  Camera,
  Calendar,
  Clock,
  IndianRupeeIcon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addDeal } from "../../api";
import { getAllproducts } from "../../../Product/api";
import { toast, Toaster } from "sonner";


const Dealoftheday = () => {
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
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [products, setProducts] = useState([]);

  const handleCancel = () => {
    navigate("/dealpage");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productName) newErrors.productName = "Product is required";
    if (!formData.offerPrice || parseFloat(formData.offerPrice) <= 0)
      newErrors.offerPrice = "Valid offer price required";
    
    const selectedProduct = products.find((p) => p._id === formData.productName);

    if (
      selectedProduct &&
      parseFloat(formData.offerPrice) >= selectedProduct.price // Changed from originalPrice to price
    ) {
      newErrors.offerPrice = "Offer price must be less than original price";
    }
    if (!formData.startDate) newErrors.startDate = "Start date required";
    if (!formData.endDate) newErrors.endDate = "End date required";
    if (!formData.startTime) newErrors.startTime = "Start time required";
    if (!formData.endTime) newErrors.endTime = "End time required";
    if (
      formData.startDate &&
      formData.endDate &&
      formData.startTime &&
      formData.endTime
    ) {
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllproducts();
        console.log("Products fetched:", response);
        setProducts(Array.isArray(response) ? response : []); 
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);
const handleSubmit = async () => {
  setSubmitError("");
  setSubmitSuccess("");
  if (!validateForm()) return;
  setIsSubmitting(true);
  try {
    const formDataToSend = new FormData();
    formDataToSend.append("productId", formData.productName);
    formDataToSend.append("title", "Deal of the Day"); 
    const startDateTime = new Date(
      `${formData.startDate}T${formData.startTime}`
    );
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
    formDataToSend.append("startTime", startDateTime.toISOString());
    formDataToSend.append("endTime", endDateTime.toISOString());
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
    const response = await addDeal(formDataToSend);

    if (response.success) {
      setSubmitSuccess("Deal added successfully!");
      console.log("Deal created:", response.data);
      setTimeout(() => {
        navigate("/dealpage");
      }, 1500);
    } else {
      setSubmitError("Failed to add deal. Please try again.");
    }
  } catch (error) {
    console.error("Error adding deal:", error);
    if (error.response?.data?.message) {
      setSubmitError(error.response.data.message);
    } else {
      setSubmitError("Failed to add deal. Please try again.");
    }
  } finally {
    setIsSubmitting(false);
  }
};


  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
    if (submitError) setSubmitError("");
    if (submitSuccess) setSubmitSuccess("");
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
      // Clear image error if file is valid
      if (errors.image) {
        setErrors({ ...errors, image: "" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Deal</h1>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5" />
          {submitSuccess}
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          {submitError}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Package className="w-5 h-5" /> Product Information
          </h2>
          <select
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Choose a product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.productName && (
            <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Camera className="w-5 h-5" /> Product Image
          </h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSubmitting}
            className={`w-full p-3 border rounded-lg ${
              errors.image ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
          {formData.image && (
            <p className="text-green-600 text-sm mt-2">
              Selected: {formData.image.name} (
              {(formData.image.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Dates */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" /> Deal Duration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                disabled={isSubmitting}
                className={`w-full p-3 border rounded-lg ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                disabled={isSubmitting}
                className={`w-full p-3 border rounded-lg ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                disabled={isSubmitting}
                className={`w-full p-3 border rounded-lg ${
                  errors.startTime ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
                disabled={isSubmitting}
                className={`w-full p-3 border rounded-lg ${
                  errors.endTime ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
              )}
            </div>
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
            disabled={isSubmitting}
            className={`w-full p-3 border rounded-lg ${
              errors.offerPrice ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.offerPrice && (
            <p className="text-red-500 text-sm mt-1">{errors.offerPrice}</p>
          )}

          {formData.productName && formData.offerPrice && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span>Original Price:</span>
                <span className="font-medium">
                  ₹
                  {products
                    .find((p) => p._id === formData.productName) // Changed to use _id
                    ?.price.toFixed(2)} {/* Changed from originalPrice to price */}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Offer Price:</span>
                <span className="font-medium text-green-600">
                  ₹{parseFloat(formData.offerPrice || 0).toFixed(2)}
                </span>
              </div>
              {formData.offerPrice && (
                <div className="flex justify-between items-center text-sm">
                  <span>Discount:</span>
                  <span className="font-medium text-red-600">
                    {Math.round(
                      ((products.find((p) => p._id === formData.productName) // Changed to use _id
                        ?.price - // Changed from originalPrice to price
                        parseFloat(formData.offerPrice)) /
                        products.find((p) => p._id === formData.productName) // Changed to use _id
                          ?.price) * // Changed from originalPrice to price
                        100
                    )}
                    % OFF
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Add Deal
              </>
            )}
          </button>
        </div>
      </div>
      <Toaster position="top-right" richColors/>
    </div>
  );
};

export default Dealoftheday;