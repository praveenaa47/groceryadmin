import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Eye, User, Calendar, Activity } from 'lucide-react';
import { viewSubadminActivity } from '../api'; 

const ActivityLogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Fetch logs from API
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await viewSubadminActivity();
        setLogs(response.logs || []); 
      } catch (error) {
        console.error("Failed to fetch activity logs", error);
      }
    };
    fetchLogs();
  }, []);

  const toggleRowExpansion = (id) => {
    const newExpanded = new Set(expandedRows);
    newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id);
    setExpandedRows(newExpanded);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionBadgeColor = (action) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800 border-green-200';
      case 'update': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delete': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'subadmin': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc'
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Activity Logs</h2>
          </div>
          <div className="text-sm text-gray-500">
            {logs.length} total entries
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  className="flex items-center space-x-1 hover:text-gray-700"
                  onClick={() => handleSort('admin')}
                >
                  <span>User</span>
                  <SortIcon field="admin" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  className="flex items-center space-x-1 hover:text-gray-700"
                  onClick={() => handleSort('createdAt')}
                >
                  <span>Date</span>
                  <SortIcon field="createdAt" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log, index) => (
              <React.Fragment key={log._id}>
                <tr className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{log.admin?.name || 'Unknown User'}</div>
                        <div className="text-sm text-gray-500">{log.admin?.email || 'No email'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md border ${getRoleBadgeColor(log.role)}`}>
                      {log.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.module}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md border ${getActionBadgeColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {formatDate(log.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleRowExpansion(log._id)}
                      className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                      {expandedRows.has(log._id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
                {expandedRows.has(log._id) && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">Additional Details</h4>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <span className="text-xs font-medium text-gray-500 block">Log ID</span>
                            <span className="text-sm text-gray-900 font-mono">{log._id}</span>
                          </div>
                          {log.recordId && (
                            <div>
                              <span className="text-xs font-medium text-gray-500 block">Record ID</span>
                              <span className="text-sm text-gray-900 font-mono">{log.recordId}</span>
                            </div>
                          )}
                          {log.ipAddress && (
                            <div>
                              <span className="text-xs font-medium text-gray-500 block">IP Address</span>
                              <span className="text-sm text-gray-900">{log.ipAddress}</span>
                            </div>
                          )}
                          {log.userAgent && (
                            <div>
                              <span className="text-xs font-medium text-gray-500 block">User Agent</span>
                              <span className="text-sm text-gray-900 truncate">{log.userAgent}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-xs font-medium text-gray-500 block">Updated At</span>
                            <span className="text-sm text-gray-900">{formatDate(log.updatedAt)}</span>
                          </div>
                          {log.admin?._id && (
                            <div>
                              <span className="text-xs font-medium text-gray-500 block">Admin ID</span>
                              <span className="text-sm text-gray-900 font-mono">{log.admin._id}</span>
                            </div>
                          )}
                        </div>
                        {log.after && (
                          <div className="mt-4">
                            <span className="text-xs font-medium text-gray-500 block mb-2">After State</span>
                            <div className="bg-white p-3 rounded border text-xs font-mono text-gray-700 max-h-32 overflow-y-auto">
                              {JSON.stringify(log.after, null, 2)}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogsTable;
