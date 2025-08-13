import React, { useState } from 'react';
import { Edit3, Trash2, Plus, Save, X } from 'lucide-react';

const DealList = () => {
  const [deals, setDeals] = useState([
    { id: 1, productName: "Fresh Tomatoes (1 kg)", originalPrice: 5.99, offerPrice: 3.99 },
    { id: 2, productName: "Organic Spinach Bundle", originalPrice: 3.99, offerPrice: 2.49 },
    { id: 3, productName: "Red Bell Peppers (500g)", originalPrice: 6.99, offerPrice: 4.99 },
    { id: 4, productName: "Fresh Broccoli Head", originalPrice: 4.49, offerPrice: 2.99 },
    { id: 5, productName: "Sweet Corn (4 pieces)", originalPrice: 4.99, offerPrice: 3.49 },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [newDeal, setNewDeal] = useState({ productName: '', originalPrice: '', offerPrice: '' });

  const startEdit = (deal) => {
    setEditingId(deal.id);
    setEditForm({ ...deal });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    setDeals(deals.map(deal => 
      deal.id === editingId ? { 
        ...editForm, 
        originalPrice: parseFloat(editForm.originalPrice),
        offerPrice: parseFloat(editForm.offerPrice) 
      } : deal
    ));
    setEditingId(null);
    setEditForm({});
  };

  const deleteDeal = (id) => {
    setDeals(deals.filter(deal => deal.id !== id));
  };

  const addDeal = () => {
    if (newDeal.productName && newDeal.originalPrice && newDeal.offerPrice) {
      const deal = {
        id: Date.now(),
        productName: newDeal.productName,
        originalPrice: parseFloat(newDeal.originalPrice),
        offerPrice: parseFloat(newDeal.offerPrice)
      };
      setDeals([...deals, deal]);
      setNewDeal({ productName: '', originalPrice: '', offerPrice: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div >
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map(deal => (
            <div key={deal.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
              {editingId === deal.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.productName}
                    onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Vegetable Name (with quantity)"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.originalPrice}
                    onChange={(e) => setEditForm({ ...editForm, originalPrice: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Original Price"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.offerPrice}
                    onChange={(e) => setEditForm({ ...editForm, offerPrice: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Offer Price"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" />
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 leading-tight">
                      {deal.productName}
                    </h3>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => startEdit(deal)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit vegetable offer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteDeal(deal.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete vegetable offer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg text-gray-400 line-through">
                        ₹{deal.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{deal.offerPrice.toFixed(2)}
                      </span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {Math.round(((deal.originalPrice - deal.offerPrice) / deal.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {deals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-500">Add your first vegetable offer to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealList;