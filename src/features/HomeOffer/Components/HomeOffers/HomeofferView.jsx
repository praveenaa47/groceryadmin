import React, { useEffect, useState } from "react";
import {
  Edit2,
  Trash2,
  MoreVertical,
  Search,
  Plus,
  Calendar,
  Tag,
  Play,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { deleteHomeoffer, getHomeoffer } from "../../api";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../../../Components/shared/DeleteModal";
import { toast, Toaster } from "sonner";


const HomeOfferView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(null);
  const [showGifModal, setShowGifModal] = useState(null);
  const [homeOffers, setHomeOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [IsDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchHomeOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getHomeoffer();
      console.log("API Response:", response);
      setHomeOffers([response]);
    } catch (error) {
      console.error("Failed to get home offers:", error);
      setError("Failed to load home offers. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHomeOffers();
  }, []);

  const filteredOffers = homeOffers.filter((offer) => {
    const searchLower = searchTerm.toLowerCase();
    const createdDate = new Date(offer.createdAt)
      .toLocaleDateString()
      .toLowerCase();
    const offerId = offer._id.toLowerCase();

    return createdDate.includes(searchLower) || offerId.includes(searchLower);
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
const handleDeleteClick = (offer) => {
  setOfferToDelete(offer);
  setIsDeleteModalOpen(true); 
};

  const handleConfirmDelete = async () => {
    if (!offerToDelete) return;
    setIsDeleting(true);
    try {
      await deleteHomeoffer(offerToDelete._id);
      setHomeOffers((prev) => prev.filter((o) => o._id !== offerToDelete._id));
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error("Failed to delete offer");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setOfferToDelete(null);
    }
  };

  const handleAddHomeOffer = () => {
    navigate("/add-home-offer");
  };

  const getImageUrl = (imagePath) => {
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    return `https://your-api-base-url${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading home offers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Home Offers</h1>
          </div>
          <button
            onClick={handleAddHomeOffer}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 shadow-md hover:shadow-lg hover:bg-blue-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Offer</span>
          </button>
        </div>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by date or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        {filteredOffers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {homeOffers.length === 0
                ? "No offers found"
                : "No matching offers"}
            </h3>
            <p className="text-gray-600 mb-6">
              {homeOffers.length === 0
                ? "Get started by creating your first home offer."
                : "Try adjusting your search to find what you're looking for."}
            </p>
            {homeOffers.length === 0 && (
              <button
                onClick={handleAddHomeOffer}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Offer</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <div
                key={offer._id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={getImageUrl(offer.backgroundImage)}
                    alt="Home offer background"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgOTZMMTI4IDgwTDExMiA5NkwxMjggMTEyTDE0NCA5NloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                    }}
                  />
                  {offer.gif && (
                    <>
                      <div className="absolute top-3 left-3 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        GIF
                      </div>
                      <button
                        onClick={() => setShowGifModal(offer)}
                        className="absolute bottom-3 left-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all shadow-md"
                      >
                        <Play className="w-4 h-4 text-gray-700" />
                      </button>
                    </>
                  )}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() =>
                        setShowDropdown(
                          showDropdown === offer._id ? null : offer._id
                        )
                      }
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all shadow-md"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-700" />
                    </button>

                    {showDropdown === offer._id && (
                      <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                        {/* <button
                          onClick={() => handleAction('edit', offer._id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </button> */}
                       
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatDate(offer.createdAt)}
                      </span>
                    </div>
                    
                  </div>
                   <button
                          onClick={() => handleDeleteClick(offer)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {showGifModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h3 className="font-semibold text-gray-900">GIF Preview</h3>
                  <p className="text-sm text-gray-600">
                    Created: {formatDate(showGifModal.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setShowGifModal(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 max-h-[70vh] overflow-auto">
                <div className="flex justify-center">
                  <img
                    src={getImageUrl(showGifModal.gif)}
                    alt="GIF Preview"
                    className="max-w-full max-h-full object-contain rounded-lg"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE4MCAxMzBMMTYwIDE1MEwxODAgMTcwTDIwMCAxNTBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvdmc+";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Click outside to close dropdown */}
        {showDropdown && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(null)}
          />
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="This Record"
      />
      <Toaster position="top-right" richColor />
    </div>
  );
};

export default HomeOfferView;
