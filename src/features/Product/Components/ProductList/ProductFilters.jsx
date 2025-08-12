import React from "react";
import { Search, Filter } from "lucide-react";

const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  stockFilter,
  setStockFilter,
  priceFilter,
  setPriceFilter,
  clearFilters,
}) => {
  return (
    <div className="mb-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200  mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Stock Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Stock</option>
              <option value="low">Low Stock (≤10)</option>
              <option value="medium">Medium Stock (11-25)</option>
              <option value="high">High Stock (25+)</option>
            </select>
          </div>

          {/* Price Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Prices</option>
              <option value="under50">Under  ₹50</option>
              <option value="50to100"> ₹50 -  ₹100</option>
              <option value="100to200"> ₹100 -  ₹200</option>
              <option value="over200">Over  ₹200</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(searchTerm || stockFilter !== "all" || priceFilter !== "all") && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 px-3 py-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
