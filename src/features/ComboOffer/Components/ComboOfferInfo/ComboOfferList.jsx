// components/ComboOfferList.jsx
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import ComboOfferCard from "./ComboOfferCard";

const ComboOfferList = ({ 
  comboOffers, 
  loading, 
  onEdit, 
  onDelete, 
  onAddNew 
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Loading combo offers...</span>
      </div>
    );
  }

  if (comboOffers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
          <Plus className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No combo offers found
        </h3>
        <button
          onClick={onAddNew}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-lg mx-auto"
        >
          <Plus className="w-5 h-5" />
          Add Your First Combo Offer
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {comboOffers.map((combo) => (
        <ComboOfferCard
          key={combo._id}
          combo={combo}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ComboOfferList;