import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, User, MapPin, CreditCard, Calendar, Truck, ArrowLeft, Edit, Check, X } from 'lucide-react';
import { getAllOrdersbyId } from '../api'; 
import { toast, Toaster } from 'sonner';

const OrderView = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { orderId } = useParams(); 
  const navigate = useNavigate();

  // Available status options
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        setError('Order ID not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getAllOrdersbyId(orderId);
        setOrderData(data);
        setSelectedStatus(data.status);
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order:', err);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const handleGoBack = () => {
    navigate(-1); 
  };

  const handleEditStatus = () => {
    setIsEditingStatus(true);
    setSelectedStatus(orderData.status);
  };

  const handleCancelEdit = () => {
    setIsEditingStatus(false);
    setSelectedStatus(orderData.status);
  };

  const handleUpdateStatus = async () => {
    if (selectedStatus === orderData.status) {
      setIsEditingStatus(false);
      return;
    }

    try {
      setUpdatingStatus(true);
      
      // Add your API call here to update the order status
      // Example: await updateOrderStatus(orderId, selectedStatus);
      
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setOrderData(prev => ({ ...prev, status: selectedStatus }));
      setIsEditingStatus(false);
      toast.success('Order status updated successfully');
      
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
      setSelectedStatus(orderData.status); // Reset to original status
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'unpaid': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <p className="text-gray-600">{error || 'No order data available'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div >
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <button
              onClick={handleGoBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-gray-600">Order ID: <span className="font-mono text-sm">{orderData._id}</span></p>
            </div>
            <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
              {/* Status with Edit Functionality */}
              <div className="flex items-center gap-2">
                {isEditingStatus ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-1 rounded-full text-sm font-medium border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={updatingStatus}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleUpdateStatus}
                      disabled={updatingStatus}
                      className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                      title="Save changes"
                    >
                      {updatingStatus ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={updatingStatus}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(orderData.status)}`}>
                      {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                    </span>
                    <button
                      onClick={handleEditStatus}
                      className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                      title="Edit status"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Payment Status */}
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(orderData.paymentStatus)}`}>
                Payment {orderData.paymentStatus.charAt(0).toUpperCase() + orderData.paymentStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium text-gray-700">Name:</span> {orderData.user.name}</p>
              <p><span className="font-medium text-gray-700">Customer ID:</span> <span className="font-mono text-sm">{orderData.user._id}</span></p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
            </div>
            <div className="space-y-1">
              <p className="font-medium">{orderData.shippingAddress.name}</p>
              <p>{orderData.shippingAddress.house}</p>
              <p>{orderData.shippingAddress.street}</p>
              <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.state}</p>
              <p>{orderData.shippingAddress.postalCode}</p>
              <p className="text-blue-600 font-medium flex items-center">
                {orderData.shippingAddress.phone}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium text-gray-700">Method:</span> {orderData.paymentMethod}</p>
              <p><span className="font-medium text-gray-700">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${getPaymentStatusColor(orderData.paymentStatus)}`}>
                  {orderData.paymentStatus.charAt(0).toUpperCase() + orderData.paymentStatus.slice(1)}
                </span>
              </p>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Order Timeline</h2>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium text-gray-700">Created:</span> {formatDate(orderData.createdAt)}</p>
              <p><span className="font-medium text-gray-700">Last Updated:</span> {formatDate(orderData.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <div className="flex items-center mb-4">
            <Package className="h-5 w-5 text-orange-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Product ID</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Weight</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Quantity</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Unit Price</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Total</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Type</th>
                </tr>
              </thead>
              <tbody>
                {orderData.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-2 font-mono text-sm">{item.product._id}</td>
                    <td className="py-3 px-2">{item.weight} {item.measurm}</td>
                    <td className="py-3 px-2 text-center">{item.quantity}</td>
                    <td className="py-3 px-2">₹{item.product.price.toLocaleString()}</td>
                    <td className="py-3 px-2 font-medium">₹{(item.price * item.quantity).toLocaleString()}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded text-sm ${item.isCombo ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {item.isCombo ? 'Combo' : 'Single'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
          <div className="flex items-center mb-4">
            <Truck className="h-5 w-5 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
          </div>
          
          <div className="space-y-2 max-w-md ml-auto">
            <div className="flex justify-between">
              <span className="text-gray-700">Subtotal:</span>
              <span>₹{(orderData.totalPrice + orderData.totalDiscount).toLocaleString()}</span>
            </div>
            {orderData.totalDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-₹{orderData.totalDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>₹{orderData.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      <Toaster position='top-right' richColors/>
    </div>
  );
};

export default OrderView;