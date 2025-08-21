import React, { useState, useEffect } from "react";
import {
  Package,
  Eye,
  Phone,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { getAllOrders } from "../api";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigate = useNavigate()

  const transformApiData = (apiData) => {
    return apiData.map((order) => {
      const getAddress = () => {
        if (order.shippingAddress) {
          const addr = order.shippingAddress;
          const parts = [
            addr.house || addr.address,
            addr.street,
            addr.city,
            addr.state,
            addr.postalCode,
            addr.country
          ].filter(part => part && part.trim() !== "");
          return parts.join(", ");
        }
        if (order.address) {
          const addr = order.address;
          const parts = [
            addr.addressLine,
            addr.landmark,
            addr.city,
            addr.state,
            addr.pincode
          ].filter(part => part && part.trim() !== "");
          return parts.join(", ");
        }
        return "Address not available";
      };

      const getPhone = () => {
        if (order.shippingAddress?.phone) return order.shippingAddress.phone;
        if (order.address?.phone) return `+91-${order.address.phone}`;
        return "N/A";
      };

      const getName = () => {
        if (order.user?.name) return order.user.name;
        if (order.shippingAddress?.name) return order.shippingAddress.name;
        if (order.address?.fullName) return order.address.fullName;
        return "Guest User";
      };

      const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
      const orderId = `ORD-${order._id.slice(-6).toUpperCase()}`;
      const formattedItems = order.items.map(item => ({
        name: `Product (${item.weight}${item.measurm})`,
        quantity: item.quantity,
        price: item.price * item.quantity,
        weight: item.weight,
        unit: item.measurm,
        isCombo: item.isCombo
      }));

      return {
        orderId: orderId,
        originalId: order._id,
        customerName: getName(),
        customerPhone: getPhone(),
        customerAddress: getAddress(),
        orderDate: new Date(order.createdAt).toLocaleDateString('en-IN'),
        deliveryDate: "TBD", // Not available in API response
        totalItems: totalItems,
        totalAmount: order.totalPrice,
        totalDiscount: order.totalDiscount || 0,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        paymentStatus: order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1),
        paymentMethod: order.paymentMethod,
        items: formattedItems,
        userId: order.user?._id || null,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };
    });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllOrders();
        console.log("API Response:", data); 
        const transformedData = transformApiData(data);
        setOrders(transformedData);
        setFilteredOrders(transformedData);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (status.toLowerCase()) {
      case "delivered":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "processing":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "shipped":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "out for delivery":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case "pending":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPaymentStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (status.toLowerCase()) {
      case "paid":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "unpaid":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "refunded":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "failed":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order-view/${orderId}`);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">    
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        {/* <div className="mb-6">
          <p className="text-gray-600 mt-2">Total Orders: {orders.length}</p>
        </div> */}

        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Summary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.originalId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {order.orderId}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              {order.orderDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          {order.customerName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {order.customerPhone}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Package className="w-4 h-4 mr-2 text-gray-400" />
                          {order.totalItems} items
                        </div>
                        <div className="text-sm text-green-600 font-medium flex items-center mt-1">
                          ₹{order?.totalAmount?.toLocaleString()}
                        </div>
                        {order.totalDiscount > 0 && (
                          <div className="text-xs text-red-600">
                            -₹{order.totalDiscount}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-start">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="max-w-xs">
                            {order.customerAddress}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(order.status)}>
                          {order.status}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getPaymentStatusBadge(order.paymentStatus)}>
                          {order.paymentStatus}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {order.paymentMethod}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleViewOrder(order.originalId)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Toaster position="top-right" richColors/>
    </div>
  );
}

export default OrderTable;