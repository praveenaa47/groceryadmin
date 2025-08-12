import React, { useState } from "react";
import {
  Eye,
  Edit,
  Trash,
  Phone,
  Mail,
  MapPin,
  ShoppingCart,
  MoreVertical,
} from "lucide-react";

function CustomerTable() {
  const [customers, setCustomers] = useState([
    {
      userId: "6891f23b70ab5e244ee17e9e",
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+91 9876543210",
      location: "Mumbai, Maharashtra",
      totalOrders: 24,
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
    {
      userId: "6891f23b70ab5e244ee17e9e",
      name: "Mike Chen",
      email: "mike.chen@email.com",
      phone: "+91 7654321098",
      location: "Bangalore, Karnataka",
      totalOrders: 32,
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    },
    {
      userId: "6891f23b70ab5e244ee17e9e",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+91 6543210987",
      location: "Chennai, Tamil Nadu",
      totalOrders: 45,
      status: "Inactive",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    },
    {
      userId: "6891f23b70ab5e244ee17e9e",
      name: "David Wilson",
      email: "david.w@email.com",
      phone: "+91 5432109876",
      location: "Pune, Maharashtra",
      totalOrders: 8,
      status: "Inactive",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    },
    {
      userId: "6891f23b70ab5e244ee17e9e",
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      phone: "+91 4321098765",
      location: "Hyderabad, Telangana",
      totalOrders: 28,
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&h=40&fit=crop&crop=face",
    },
  ]);
  const [filteredCustomers, setFilteredCustomers] = useState(customers);

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Premium":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case "Inactive":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className=" px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow mb-6">
          {/* Customer Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={customer.avatar}
                          alt={customer.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.userId}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.phone}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.location}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.totalOrders} orders
                      </div>
                      {/* <div className="text-sm text-green-600 font-medium">
                        ₹{customer.totalSpent.toLocaleString()}
                      </div> */}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(customer.status)}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1">
                          <Trash className="w-4 h-4" />
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

export default CustomerTable;
