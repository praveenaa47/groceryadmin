import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye, Package, TrendingUp, TrendingDown, AlertTriangle, ShoppingCart, Star, Calendar, DollarSign, Users, BarChart3, PieChart } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, Pie, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for charts
  const monthlyOrdersData = [
    { month: 'Jan', orders: 1200, revenue: 24000, customers: 850 },
    { month: 'Feb', orders: 1350, revenue: 27000, customers: 920 },
    { month: 'Mar', orders: 1180, revenue: 23600, customers: 800 },
    { month: 'Apr', orders: 1450, revenue: 29000, customers: 980 },
    { month: 'May', orders: 1620, revenue: 32400, customers: 1100 },
    { month: 'Jun', orders: 1580, revenue: 31600, customers: 1050 },
    { month: 'Jul', orders: 1750, revenue: 35000, customers: 1200 },
    { month: 'Aug', orders: 1680, revenue: 33600, customers: 1150 },
  ];

  const categoryData = [
    { name: 'Fruits & Vegetables', value: 35, color: '#10B981' },
    { name: 'Dairy & Eggs', value: 20, color: '#3B82F6' },
    { name: 'Meat & Seafood', value: 15, color: '#8B5CF6' },
    { name: 'Beverages', value: 18, color: '#F59E0B' },
    { name: 'Bakery', value: 12, color: '#EF4444' }
  ];

  const topProductsData = [
    { name: 'Organic Bananas', sales: 245, revenue: 732.55 },
    { name: 'Fresh Milk 2L', sales: 220, revenue: 943.80 },
    { name: 'Orange Juice', sales: 203, revenue: 769.37 },
    { name: 'Premium Tomatoes', sales: 180, revenue: 808.20 },
    { name: 'Sourdough Bread', sales: 156, revenue: 934.44 }
  ];

  const categories = [
    { id: 'all', name: 'All Products', count: 156 },
    { id: 'fruits', name: 'Fruits & Vegetables', count: 45 },
    { id: 'dairy', name: 'Dairy & Eggs', count: 23 },
    { id: 'meat', name: 'Meat & Seafood', count: 18 },
    { id: 'bakery', name: 'Bakery', count: 15 },
    { id: 'beverages', name: 'Beverages', count: 32 },
    { id: 'pantry', name: 'Pantry', count: 23 }
  ];

  const products = [
    {
      id: 1,
      name: 'Organic Bananas',
      category: 'fruits',
      price: 2.99,
      stock: 150,
      rating: 4.8,
      image: '🍌',
      status: 'in-stock',
      trend: 'up',
      sales: 245,
      lastUpdated: '2 hours ago'
    },
    {
      id: 2,
      name: 'Fresh Milk 2L',
      category: 'dairy',
      price: 4.29,
      stock: 25,
      rating: 4.6,
      image: '🥛',
      status: 'low-stock',
      trend: 'down',
      sales: 189,
      lastUpdated: '1 hour ago'
    },
    {
      id: 3,
      name: 'Sourdough Bread',
      category: 'bakery',
      price: 5.99,
      stock: 0,
      rating: 4.9,
      image: '🍞',
      status: 'out-of-stock',
      trend: 'up',
      sales: 67,
      lastUpdated: '30 min ago'
    },
    {
      id: 4,
      name: 'Atlantic Salmon',
      category: 'meat',
      price: 12.99,
      stock: 45,
      rating: 4.7,
      image: '🐟',
      status: 'in-stock',
      trend: 'up',
      sales: 134,
      lastUpdated: '3 hours ago'
    },
    {
      id: 5,
      name: 'Orange Juice',
      category: 'beverages',
      price: 3.79,
      stock: 78,
      rating: 4.4,
      image: '🧃',
      status: 'in-stock',
      trend: 'stable',
      sales: 203,
      lastUpdated: '45 min ago'
    },
    {
      id: 6,
      name: 'Premium Tomatoes',
      category: 'fruits',
      price: 4.49,
      stock: 89,
      rating: 4.5,
      image: '🍅',
      status: 'in-stock',
      trend: 'up',
      sales: 156,
      lastUpdated: '1 hour ago'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800 border-green-200';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out-of-stock': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-200 pb-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'products'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Products
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹47,250</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">1,680</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8% from last month
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900">1,150</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15% from last month
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-orange-600">8</p>
              <p className="text-xs text-red-600 flex items-center mt-1">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Needs attention
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Orders Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Orders & Revenue Trends</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Orders</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyOrdersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Products</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProductsData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" stroke="#6b7280" />
            <YAxis dataKey="name" type="category" width={120} stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-200 pb-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'products'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Products
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{product.image}</span>
              <div className="flex items-center gap-2">
                {getTrendIcon(product.trend)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                  {product.status.replace('-', ' ')}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Stock: {product.stock}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">${product.price}</span>
                <span className="text-sm text-gray-500">Sales: {product.sales}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-gray-50 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-1">
                <Eye className="w-4 h-4" />
                View
              </button>
              <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'products' && renderProducts()}
    </div>
  );
};

export default Dashboard;