import React, { useEffect, useState } from "react";
import {
  Save,
  X,
  Calendar,
  Tag,
  Percent,
  Users,
  ShoppingCart,
} from "lucide-react";
import { getAllCategory } from "../../Categories/api";
import { getAllproducts } from "../../Product/api";
import { updateCoupon } from "../api";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast, Toaster } from "sonner";
import { ROUTES } from "../../../lib/constants";

const CouponEdit = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const { id } = useParams();
  const location = useLocation();
  const coupon = location.state?.coupon;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: coupon?.code || "",
    discountType: coupon?.discountType || "percentage",
    discountValue: coupon?.discountValue || "",
    usageLimit: coupon?.usageLimit || "",
    expiryDate: coupon?.expiryDate?.split("T")[0] || "",
    status: coupon?.status || "active",
    applicationType: coupon?.applicationType || "category",
    selectedCategories: coupon?.applicableCategories || [],
    selectedProducts: coupon?.applicableProducts || [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await getAllCategory();
        const prodRes = await getAllproducts();
        setCategories(catRes?.data || catRes);
        setProducts(prodRes?.data || prodRes);
      } catch (error) {
        console.error("Error fetching categories/products:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (id, type) => {
    setFormData((prev) => {
      const key =
        type === "category" ? "selectedCategories" : "selectedProducts";
      const selected = prev[key].includes(id)
        ? prev[key].filter((x) => x !== id)
        : [...prev[key], id];
      return { ...prev, [key]: selected };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateCoupon(id, formData);
      toast.success("Coupon updated successfully!");
      navigate(`${ROUTES.COUPONS}`);
    } catch (err) {
      console.error("Failed to update coupon:", err);
      toast.error("Failed to update coupon");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Add New Coupon
              </h1>
              <button className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  name="code"
                  placeholder="e.g., SAVE20"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  name="status"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Percent className="w-5 h-5" />
              Discount Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type
                </label>
                <select
                  value={formData.discountType}
                  name="discountType"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value *
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    placeholder="20"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Limit *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    placeholder="100"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Apply Coupon To
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Type *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="applicationType"
                    value="category"
                    checked={formData.applicationType === "category"}
                    onChange={handleChange}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    By Category
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="applicationType"
                    value="product"
                    checked={formData.applicationType === "product"}
                    onChange={handleChange}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    By Products
                  </span>
                </label>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {formData.applicationType === "category" &&
                categories.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors border-gray-200 hover:border-gray-300 mb-2"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.selectedCategories.includes(cat._id)}
                        onChange={() =>
                          handleCheckboxChange(cat._id, "category")
                        }
                        className="text-blue-600 focus:ring-blue-500 mr-3"
                      />
                      <div className="text-sm font-medium text-gray-900">
                        {cat.name}
                      </div>
                    </div>
                  </label>
                ))}

              {formData.applicationType === "product" &&
                products.map((prod) => (
                  <label
                    key={prod._id}
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors border-gray-200 hover:border-gray-300 mb-2"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.selectedProducts.includes(prod._id)}
                        onChange={() =>
                          handleCheckboxChange(prod._id, "product")
                        }
                        className="text-blue-600 focus:ring-blue-500 mr-3"
                      />
                      <div className="text-sm font-medium text-gray-900">
                        {prod.name}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      ₹{prod.price}
                    </div>
                  </label>
                ))}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Edit Coupon
            </button>
          </div>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default CouponEdit;
