import React from "react";
import { Plus, Minus } from "lucide-react";

const EditWeightStockManager = ({ weightsAndStocks, setWeightsAndStocks }) => {
  const addWeightStock = () => {
    setWeightsAndStocks([
      ...weightsAndStocks,
      { weight: "", measurm: "g", weight_price: "", quantity: "" },
    ]);
  };

  const removeWeightStock = (index) => {
    if (weightsAndStocks.length > 1) {
      setWeightsAndStocks(weightsAndStocks.filter((_, i) => i !== index));
    }
  };

  const updateWeightStock = (index, field, value) => {
    const updated = weightsAndStocks.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setWeightsAndStocks(updated);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Weights & Stocks *</h2>
        <button
          type="button"
          onClick={addWeightStock}
          className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Weight
        </button>
      </div>

      <div className="space-y-3">
        {weightsAndStocks.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border rounded-md"
          >
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Weight
              </label>
              <input
                type="text"
                value={item.weight}
                onChange={(e) =>
                  updateWeightStock(index, "weight", e.target.value)
                }
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                value={item.measurm}
                onChange={(e) =>
                  updateWeightStock(index, "measurm", e.target.value)
                }
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="lb">lb</option>
                <option value="piece">piece</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                value={item.weight_price}
                onChange={(e) =>
                  updateWeightStock(index, "weight_price", e.target.value)
                }
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="100"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateWeightStock(index, "quantity", e.target.value)
                }
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="25"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeWeightStock(index)}
                disabled={weightsAndStocks.length === 1}
                className="w-full px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <Minus className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditWeightStockManager;