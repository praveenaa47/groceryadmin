import React, { useState } from "react";
import {
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  Download,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  MoreVertical,
} from "lucide-react";

function OrderTable() {
  const orders = [
    {
      orderId: "ORD-001234",
      customerName: "John Doe",
      customerPhone: "+91 9876543210",
      customerAddress: "123 Main St, Mumbai, Maharashtra",
      orderDate: "2024-08-11",
      deliveryDate: "2024-08-12",
      totalItems: 8,
      totalAmount: 1250.75,
      status: "Delivered",
      paymentStatus: "Paid",
      paymentMethod: "COD",
      items: [
        { name: "Organic Honey Crisp Apples", quantity: 2, price: 299.98 },
        { name: "Fresh Milk - 1L", quantity: 3, price: 180.00 },
        { name: "Whole Wheat Bread", quantity: 1, price: 45.00 }
      ]
    },
    {
      orderId: "ORD-001235",
      customerName: "Sarah Johnson",
      customerPhone: "+91 8765432109",
      customerAddress: "456 Oak Ave, Delhi, Delhi",
      orderDate: "2024-08-11",
      deliveryDate: "2024-08-13",
      totalItems: 12,
      totalAmount: 2150.50,
      status: "Processing",
      paymentStatus: "Paid",
      paymentMethod: "Card",
      items: [
        { name: "Fresh Vegetables Bundle", quantity: 1, price: 450.00 },
        { name: "Basmati Rice - 5kg", quantity: 2, price: 800.00 },
        { name: "Cooking Oil - 1L", quantity: 1, price: 165.00 }
      ]
    },
    {
      orderId: "ORD-001236",
      customerName: "Mike Chen",
      customerPhone: "+91 7654321098",
      customerAddress: "789 Pine St, Bangalore, Karnataka",
      orderDate: "2024-08-10",
      deliveryDate: "2024-08-12",
      totalItems: 6,
      totalAmount: 890.25,
      status: "Shipped",
      paymentStatus: "Paid",
      paymentMethod: "UPI",
      items: [
        { name: "Fresh Chicken - 1kg", quantity: 1, price: 320.00 },
        { name: "Onions - 2kg", quantity: 1, price: 80.00 },
        { name: "Tomatoes - 1kg", quantity: 1, price: 60.00 }
      ]
    },
    {
      orderId: "ORD-001237",
      customerName: "Emily Davis",
      customerPhone: "+91 6543210987",
      customerAddress: "321 Elm St, Chennai, Tamil Nadu",
      orderDate: "2024-08-11",
      deliveryDate: "2024-08-14",
      totalItems: 15,
      totalAmount: 3200.00,
      status: "Pending",
      paymentStatus: "Pending",
      paymentMethod: "COD",
      items: [
        { name: "Grocery Combo Pack", quantity: 1, price: 1200.00 },
        { name: "Fresh Fruits Basket", quantity: 2, price: 600.00 },
        { name: "Dairy Products Bundle", quantity: 1, price: 450.00 }
      ]
    },
    {
      orderId: "ORD-001238",
      customerName: "David Wilson",
      customerPhone: "+91 5432109876",
      customerAddress: "654 Maple Dr, Pune, Maharashtra",
      orderDate: "2024-08-09",
      deliveryDate: "2024-08-11",
      totalItems: 4,
      totalAmount: 675.50,
      status: "Cancelled",
      paymentStatus: "Refunded",
      paymentMethod: "UPI",
      items: [
        { name: "Organic Vegetables", quantity: 2, price: 300.00 },
        { name: "Fresh Eggs - 12pcs", quantity: 1, price: 120.00 },
        { name: "Greek Yogurt", quantity: 2, price: 180.00 }
      ]
    },
    {
      orderId: "ORD-001239",
      customerName: "Lisa Anderson",
      customerPhone: "+91 4321098765",
      customerAddress: "987 Cedar Ln, Hyderabad, Telangana",
      orderDate: "2024-08-11",
      deliveryDate: "2024-08-12",
      totalItems: 10,
      totalAmount: 1850.75,
      status: "Out for Delivery",
      paymentStatus: "Paid",
      paymentMethod: "COD",
      items: [
        { name: "Fresh Meat Selection", quantity: 1, price: 650.00 },
        { name: "Seasonal Fruits", quantity: 3, price: 420.00 },
        { name: "Spices & Condiments", quantity: 1, price: 180.00 }
      ]
    },
    {
      orderId: "ORD-001240",
      customerName: "Robert Taylor",
      customerPhone: "+91 3210987654",
      customerAddress: "147 Birch St, Kolkata, West Bengal",
      orderDate: "2024-08-10",
      deliveryDate: "2024-08-13",
      totalItems: 7,
      totalAmount: 1120.25,
      status: "Processing",
      paymentStatus: "Paid",
      paymentMethod: "UPI",
      items: [
        { name: "Frozen Foods Pack", quantity: 2, price: 480.00 },
        { name: "Beverages Bundle", quantity: 1, price: 250.00 },
        { name: "Snacks Variety Pack", quantity: 1, price: 180.00 }
      ]
    }
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Delivered":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Processing":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "Shipped":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "Out for Delivery":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case "Pending":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case "Cancelled":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPaymentStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Paid":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "Refunded":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "Failed":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Processing":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "Shipped":
        return <Truck className="w-4 h-4 text-yellow-600" />;
      case "Out for Delivery":
        return <Truck className="w-4 h-4 text-purple-600" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-gray-600" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen ">    
      <div className=" px-4 sm:px-6 lg:px-8 py-8">
        {/* Orders Table */}
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
                {orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
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
                        {order.totalItems} items
                      </div>
                      <div className="text-sm text-green-600 font-medium flex items-center mt-1">
                        ₹{order.totalAmount.toLocaleString()}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-start">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="max-w-xs">
                          {order.customerAddress}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-2">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        Delivery: {order.deliveryDate}
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
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTable;