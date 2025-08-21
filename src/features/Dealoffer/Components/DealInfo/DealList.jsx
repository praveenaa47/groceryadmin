import React, { useState, useEffect } from "react";
import { Trash2, Calendar, Clock, Package, Edit } from "lucide-react";
import { deleteDeal, getallDeal } from "../../api";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import DeleteConfirmationModal from "../../../../Components/shared/DeleteModal";

const DealList = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getallDeal();

      if (response.success && response.data) {
        const transformedDeals = response.data.map((deal) => ({
          id: deal._id,
          productName: deal.title,
          originalPrice: deal.originalPrice || 0,
          offerPrice: deal.offerPrice || 0,
          description: deal.description || "",
          stock: deal.stock || 0,
          startDate: deal.startTime
            ? new Date(deal.startTime).toISOString().split("T")[0]
            : "",
          endDate: deal.endTime
            ? new Date(deal.endTime).toISOString().split("T")[0]
            : "",
          startTime: deal.startTime
            ? new Date(deal.startTime).toTimeString().slice(0, 5)
            : "",
          endTime: deal.endTime
            ? new Date(deal.endTime).toTimeString().slice(0, 5)
            : "",
          image:
            deal.image ||
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjI1IiBmaWxsPSIjRUY0NDQ0Ii8+Cjwvc3ZnPgo=",
        }));
        setDeals(transformedDeals);
      } else {
        setError("Failed to load deals");
      }
    } catch (err) {
      console.error("Error fetching deals:", err);
      setError("Failed to load deals. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteClick = (deal) => {
    setDealToDelete(deal);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!dealToDelete) return;
    try {
      setIsDeleting(true);
      await deleteDeal(dealToDelete.id);
      setDeals((prevDeals) =>
        prevDeals.filter((d) => d.id !== dealToDelete.id)
      );
      toast.success("Deal deleted successfully");
      setIsDeleteModalOpen(false);
      setDealToDelete(null);
    } catch (error) {
      console.error("Error deleting deal:", error);
      toast.error("Failed to delete deal. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setDealToDelete(null);
    }
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return "Not set";
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const getStatus = (deal) => {
    if (!deal.startDate || !deal.endDate || !deal.startTime || !deal.endTime) {
      return { text: "Incomplete", color: "bg-gray-100 text-gray-700" };
    }
    const now = new Date();
    const startDateTime = new Date(`${deal.startDate}T${deal.startTime}`);
    const endDateTime = new Date(`${deal.endDate}T${deal.endTime}`);
    if (now < startDateTime) {
      return { text: "Scheduled", color: "bg-blue-100 text-blue-700" };
    } else if (now >= startDateTime && now <= endDateTime) {
      return { text: "Active", color: "bg-green-100 text-green-700" };
    } else {
      return { text: "Expired", color: "bg-red-100 text-red-700" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Deal Management
            </h1>
          </div>
          <div className="flex justify-center items-center py-16">
            <div className="text-gray-600">Loading deals...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => {
            const status = getStatus(deal);
            return (
              <div
                key={deal.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {deal.image && (
                  <div className="h-48 bg-gray-100">
                    <img
                      src={deal.image}
                      alt={deal.productName}
                      className="w-full h-full object-cover"
                      // onError={(e) => {
                      //   e.target.src =
                      //     "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjI1IiBmaWxsPSIjRUY0NDQ0Ii8+Cjwvc3ZnPgo=";
                      // }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {deal.productName}
                      </h3>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}
                      >
                        {status.text}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(deal)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete deal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {/* <button
                      onClick={() => navigate(`/editdeal/${deal.id}`)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit deal"
                    >
                      <Edit className="w-4 h-4" />
                    </button> */}
                  </div>
                  {(deal.originalPrice > 0 || deal.offerPrice > 0) && (
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        {deal.originalPrice > 0 && (
                          <span className="text-lg text-gray-400 line-through">
                            ₹{deal.originalPrice.toFixed(2)}
                          </span>
                        )}
                        {deal.offerPrice > 0 && (
                          <span className="text-2xl font-bold text-green-600">
                            ₹{deal.offerPrice.toFixed(2)}
                          </span>
                        )}
                        {deal.originalPrice > 0 && deal.offerPrice > 0 && (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                            {Math.round(
                              ((deal.originalPrice - deal.offerPrice) /
                                deal.originalPrice) *
                                100
                            )}
                            % OFF
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDateTime(deal.startDate, deal.startTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        Until {formatDateTime(deal.endDate, deal.endTime)}
                      </span>
                    </div>
                    {deal.stock > 0 && (
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>{deal.stock} items remaining</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {deals.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <Package className="w-20 h-20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No deals yet
              </h3>
            </div>
          </div>
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        itemName={`deal "${dealToDelete?.productName}"`}
        isLoading={isDeleting}
      />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default DealList;
