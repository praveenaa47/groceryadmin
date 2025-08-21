import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteSubadmin, viewSubadmin } from "../api";
import DeleteConfirmationModal from "../../../Components/shared/DeleteModal";
import { toast, Toaster } from "sonner";

const SubAdminList = () => {
  const [subadmins, setSubadmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subadminToDelete, setSubadminToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch subadmins data
  const fetchSubadmins = async () => {
    try {
      setLoading(true);
      const response = await viewSubadmin();
      const transformedData = response.admins.map((admin, index) => ({
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: "N/A",
        status: "Active",
        permissions: Array.isArray(admin.permissions)
          ? admin.permissions
          : [admin.permissions],
        createdDate: new Date(admin.createdAt).toLocaleDateString(),
        lastLogin: "N/A",
        role: admin.role,
      }));

      setSubadmins(transformedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching subadmins:", err);
      setError("Failed to fetch subadmin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubadmins();
  }, []);

  const handleDeleteClick = (subadmin) => {
    setSubadminToDelete(subadmin);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!subadminToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteSubadmin(subadminToDelete.id);
      setSubadmins(
        subadmins.filter((subadmin) => subadmin.id !== subadminToDelete.id)
      );
      setIsDeleteModalOpen(false);
      setSubadminToDelete(null);
      toast.success("Subadmin deleted successfully");
    } catch (err) {
      console.error("Error deleting subadmin:", err);
      toast.error("Failed to delete subadmin. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSubadminToDelete(null);
  };

  const filteredSubadmins = subadmins.filter((subadmin) => {
    const matchesSearch =
      subadmin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subadmin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subadmin.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || subadmin.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddSubadmin = () => {
    navigate("/add-sub-admins");
  };

  const handleEdit = (row) => {
    navigate(`/edit-sub-admin/${row.id}`, { state: { subadmin: row } });
  };

  const handleView = (id) => {
    console.log("View subadmin:", id);
    navigate(`/view-sub-admin/${id}`);
  };

  const getStatusBadge = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">SubAdmin List</h1>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading subadmins...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SubAdmin List</h1>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search subadmins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleAddSubadmin}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Subadmin
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              SubAdmin List ({filteredSubadmins.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubadmins.map((subadmin, index) => (
                  <tr
                    key={subadmin.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {subadmin.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subadmin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {subadmin.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                          subadmin.status
                        )}`}
                      >
                        {subadmin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {subadmin.permissions.length > 0 &&
                        subadmin.permissions[0] !== "" ? (
                          subadmin.permissions.map((permission, idx) => (
                            <span
                              key={idx}
                              className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                            >
                              {permission}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 italic">
                            No permissions
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subadmin.createdDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(subadmin)}
                          className="text-green-600 hover:text-green-900 p-1 rounded transition-colors duration-150"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(subadmin)}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors duration-150"
                          title="Delete"
                          disabled={deleteLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubadmins.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No subadmins found</p>
              <p className="text-gray-400 mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={subadminToDelete ? `${subadminToDelete.name}` : "This Record"}
        loading={deleteLoading}
      />
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default SubAdminList;
