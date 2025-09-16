import React, { useEffect, useState } from "react";
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
import { deleteCustomer, getAllCustomer } from "../api";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../../Components/shared/DeleteModal";
import { toast, Toaster } from "sonner";

function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); 

  const navigate = useNavigate();

  const getStatusBadge = (isVerified, status) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";

    if (status === "active" && isVerified) {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (status === "active" && !isVerified) {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    } else {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
  };

  const getStatusText = (isVerified, status) => {
    if (status === "active" && isVerified) {
      return "Active";
    } else if (status === "active" && !isVerified) {
      return "Pending";
    } else {
      return "Inactive";
    }
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteCustomer(customerToDelete.userId);
      setCustomers((prev) =>
        prev.filter((customer) => customer.userId !== customerToDelete.userId)
      );
      setFilteredCustomers((prev) =>
        prev.filter((customer) => customer.userId !== customerToDelete.userId)
      );
      toast.success("Customer deleted successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete customer";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  const transformApiData = (apiData) => {
    return apiData.users.map((user) => ({
      userId: user._id,
      name: user.name,
      email: user.email || "N/A",
      phone: user.number,
      location:
        user.devices.length > 0 ? `IP: ${user.devices[0].ip}` : "Unknown",
      totalOrders: 0,
      status: getStatusText(user.isVerified, user.status),
      isVerified: user.isVerified,
      coins: user.coins,
      referralCode: user.referralCode,
      createdAt: new Date(user.createdAt).toLocaleDateString(),
      lastLogin:
        user.devices.length > 0
          ? new Date(
              user.devices[user.devices.length - 1].lastLogin
            ).toLocaleDateString()
          : "Never",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.name
      )}&background=random`,
    }));
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await getAllCustomer();
        const transformedData = transformApiData(data);
        setCustomers(transformedData);
        setFilteredCustomers(transformedData);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
        toast.error("Failed to fetch customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleview = (customerId) => {
    navigate(`/customer-view/${customerId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Customer Management
          </h1>
          <p className="text-gray-600 mt-2">
            Total Customers: {customers.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow mb-6">
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
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coins
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
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
                              {customer.referralCode}
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
                        <div className="text-sm text-gray-500">
                          Last: {customer.lastLogin}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <ShoppingCart className="w-4 h-4 mr-2 text-gray-400" />
                          {customer.coins} coins
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={getStatusBadge(
                            customer.isVerified,
                            customer.status
                          )}
                        >
                          {customer.status}
                        </span>
                        {/* {customer.isVerified && (
                          <div className="text-xs text-green-600 mt-1">
                            ✓ Verified
                          </div>
                        )} */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleview(customer.userId)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(customer)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                            disabled={isDeleting}
                          >
                            <Trash className="w-4 h-4" />
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
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={customerToDelete?.name || "This Customer"}
        isLoading={isDeleting}
      />
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default CustomerTable;
