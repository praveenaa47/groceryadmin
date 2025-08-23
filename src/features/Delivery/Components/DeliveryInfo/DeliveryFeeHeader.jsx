import React from 'react';
import { Plus } from 'lucide-react';

const DeliveryFeeHeader = ({ title, onAdd }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Fee
        </button>
      </div>
    </div>
  );
};

export default DeliveryFeeHeader;