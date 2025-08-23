// components/ProductSelection.jsx
import { Plus, X, Loader2 } from "lucide-react";

const ProductSelection = ({
  products,
  availableProducts,
  productsLoading,
  addProduct,
  removeProduct,
  updateProduct
}) => {
  // Get selected product details
  const getSelectedProduct = (productId) => {
    return availableProducts.find((p) => p._id === productId);
  };

  // Get available weights for a product from weightsAndStocks
  const getProductWeights = (productId) => {
    const product = getSelectedProduct(productId);
    if (!product || !product.weightsAndStocks) return [];

    // Return formatted weight options from weightsAndStocks
    return product.weightsAndStocks.map((weightStock) => ({
      label: `${weightStock.weight}${weightStock.measurm} - ₹${weightStock.weight_price} (Stock: ${weightStock.quantity})`,
      value: `${weightStock.weight}${weightStock.measurm}`,
      weight: weightStock.weight,
      measurm: weightStock.measurm,
      price: weightStock.weight_price,
      quantity: weightStock.quantity,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Products
        </h3>
        <button
          type="button"
          onClick={addProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {productsLoading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-gray-500">
            Loading products...
          </span>
        </div>
      )}

      {products.map((product, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 space-y-3"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">
              Product {index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeProduct(index)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product *
              </label>
              <select
                value={product.productId}
                onChange={(e) =>
                  updateProduct(index, "productId", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Select Product</option>
                {availableProducts.map((prod) => (
                  <option key={prod._id} value={prod._id}>
                    {prod.name} - ₹
                    {prod.offerPrice
                      ? `${prod.offerPrice} (was ₹${prod.price})`
                      : prod.price}
                  </option>
                ))}
              </select>

              {availableProducts.length === 0 && !productsLoading && (
                <p className="text-xs text-red-500 mt-1">
                  No products available. Please add products first.
                </p>
              )}
            </div>

            {/* Weight Selection */}
            {product.productId && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Weights & Prices
                </label>
                <select
                  value={product.selectedWeight}
                  onChange={(e) =>
                    updateProduct(
                      index,
                      "selectedWeight",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Weight & Price</option>
                  {getProductWeights(product.productId).map(
                    (weightOption, weightIndex) => (
                      <option
                        key={weightIndex}
                        value={weightOption.value}
                      >
                        {weightOption.label}
                      </option>
                    )
                  )}
                </select>
                {getProductWeights(product.productId).length ===
                  0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    No predefined weights available for this product.
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                value={product.quantity}
                onChange={(e) =>
                  updateProduct(
                    index,
                    "quantity",
                    parseInt(e.target.value) || 1
                  )
                }
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight{" "}
                {product.selectedWeight
                  ? "(from selection)"
                  : "(custom)"}
              </label>
              <input
                type="text"
                value={product.weight}
                onChange={(e) =>
                  updateProduct(index, "weight", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 500"
                disabled={!!product.selectedWeight}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                value={product.measurm}
                onChange={(e) =>
                  updateProduct(index, "measurm", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={!!product.selectedWeight}
              >
                <option value="g">grams (g)</option>
                <option value="kg">kilograms (kg)</option>
                <option value="ml">milliliters (ml)</option>
                <option value="l">liters (l)</option>
                <option value="piece">piece</option>
              </select>
            </div>

            {/* Display selected product info */}
            {product.productId && (
              <div className="md:col-span-2 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
                <div className="flex justify-between">
                  <strong>Selected Product:</strong>
                  <span>
                    {getSelectedProduct(product.productId)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>
                    ₹{getSelectedProduct(product.productId)?.price}
                  </span>
                </div>
                {getSelectedProduct(product.productId)
                  ?.offerPrice && (
                  <div className="flex justify-between">
                    <span>Offer Price:</span>
                    <span className="text-green-600 font-medium">
                      ₹
                      {
                        getSelectedProduct(product.productId)
                          ?.offerPrice
                      }
                    </span>
                  </div>
                )}
                {product.selectedWeight && (
                  <>
                    <div className="flex justify-between">
                      <span>Selected Weight:</span>
                      <span>
                        {product.weight}
                        {product.measurm}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weight Price:</span>
                      <span className="font-medium text-blue-600">
                        ₹{product.weightPrice}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available Stock:</span>
                      <span
                        className={`font-medium ${
                          product.availableStock > 10
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {product.availableStock} units
                      </span>
                    </div>
                    {product.quantity > product.availableStock && (
                      <div className="text-red-600 text-xs font-medium">
                        ⚠️ Quantity exceeds available stock!
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {products.length === 0 && (
        <p className="text-gray-500 text-sm">
          No products added yet. Click "Add Product" to get started.
        </p>
      )}
    </div>
  );
};

export default ProductSelection;