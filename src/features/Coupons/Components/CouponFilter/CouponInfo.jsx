import React, { useState, useEffect } from "react";
import { Edit, RefreshCw, Trash2 } from "lucide-react";
import { deleteCoupon, getCoupon } from "../../api";
import { toast, Toaster } from "sonner";
import DeleteConfirmationModal from "../../../../Components/shared/DeleteModal";
import { useNavigate } from "react-router-dom";

const CouponInfo = ({ onEdit = () => {}, onDelete = () => {} }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const transformApiData = (apiData) => {
    return apiData.map((coupon) => ({
      id: coupon._id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minAmount: 0,
      maxDiscount: null,
      expiryDate: coupon.expiryDate,
      status: coupon.status,
      usageCount: coupon.usedCount,
      usageLimit: coupon.usageLimit,
      applicationType: coupon.applicationType,
      applicableProducts: coupon.applicableProducts,
      applicableCategories: coupon.applicableCategories,
      createdAt: coupon.createdAt,
      updatedAt: coupon.updatedAt,
    }));
  };
  const navigate = useNavigate();

  const handleEdit = (coupon) => {
    navigate(`/admin/coupons/edit/${coupon.id}`, { state: { coupon } });
  };
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiResponse = await getCoupon();
      const dataArray = Array.isArray(apiResponse)
        ? apiResponse
        : apiResponse.coupons || [];

      const transformedData = transformApiData(dataArray);
      setCoupons(transformedData);
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setError("Failed to load coupons. Please try again.");
      toast.error("Failed to load coupons. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!couponToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCoupon(couponToDelete.id);
      setCoupons((prevCoupons) =>
        prevCoupons.filter((coupon) => coupon.id !== couponToDelete.id)
      );
      onDelete(couponToDelete);
      toast.success("Coupon deleted successfully");
      setIsDeleteModalOpen(false);
      setCouponToDelete(null);
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setCouponToDelete(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
      expired: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusClasses[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDiscount = (type, value) => {
    return type === "percentage" ? `${value}%` : `₹${value}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading coupons...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {coupons.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No coupons found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {coupon.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDiscount(
                          coupon.discountType,
                          coupon.discountValue
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.usageCount}/{coupon.usageLimit}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(
                          ((coupon.usageLimit - coupon.usageCount) /
                            coupon.usageLimit) *
                            100
                        )}
                        % remaining
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(coupon.expiryDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(coupon.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {coupon.applicationType}
                      </div>
                      {coupon.applicableProducts &&
                        coupon.applicableProducts.length > 0 && (
                          <div className="text-xs text-gray-500">
                            {coupon.applicableProducts.length} product(s)
                          </div>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Edit coupon"
                          disabled={isDeleting}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(coupon)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete coupon"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        itemName={`coupon "${couponToDelete?.code}"`}
        isLoading={isDeleting}
      />

      <Toaster position="top-right" richColors />
    </div>
  );
};

export default CouponInfo;
