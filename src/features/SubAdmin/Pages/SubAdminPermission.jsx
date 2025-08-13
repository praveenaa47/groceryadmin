import React, { useState } from 'react';
import { Eye, EyeOff, Edit2, Save, X, Plus, Trash2, History } from 'lucide-react';
import Customerfilter from '../../Customers/components/Customerfilter';

const SubAdminPermission = () => {
  const [subadmins, setSubadmins] = useState([
    {
      id: 1,
      email: 'john.doe@company.com',
      password: 'password123',
      reason: 'Account verification failed - suspicious activity detected',
      changesLog: [
        { date: '2024-01-15', change: 'Initial creation', reason: 'New employee onboarding' },
        { date: '2024-01-20', change: 'Reason updated', reason: 'Account verification failed - suspicious activity detected' }
      ]
    },
    {
      id: 2,
      email: 'jane.smith@company.com',
      password: 'securepass456',
      reason: 'Temporary access for project review',
      changesLog: [
        { date: '2024-01-18', change: 'Initial creation', reason: 'New team lead assignment' },
        { date: '2024-01-22', change: 'Reason updated', reason: 'Temporary access for project review' }
      ]
    },
    {
      id: 3,
      email: 'jane.smith@company.com',
      password: 'securepass456',
      reason: 'Temporary access for project review',
      changesLog: [
        { date: '2024-01-18', change: 'Initial creation', reason: 'New team lead assignment' },
        { date: '2024-01-22', change: 'Reason updated', reason: 'Temporary access for project review' }
      ]
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [showHistory, setShowHistory] = useState({});
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubadmin, setNewSubadmin] = useState({
    email: '',
    password: '',
    reason: ''
  });

  const availablePermissions = ['read', 'write', 'delete', 'admin', 'manage_users'];

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleHistory = (id) => {
    setShowHistory(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const startEdit = (subadmin) => {
    setEditingId(subadmin.id);
    setEditForm({
      email: subadmin.email,
      password: subadmin.password,
      reason: subadmin.reason
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    const oldSubadmin = subadmins.find(s => s.id === editingId);
    const changes = [];
    
    if (oldSubadmin.email !== editForm.email) {
      changes.push(`Email changed from ${oldSubadmin.email} to ${editForm.email}`);
    }
    if (oldSubadmin.password !== editForm.password) {
      changes.push('Password updated');
    }
    if (oldSubadmin.reason !== editForm.reason) {
      changes.push(`Reason changed from "${oldSubadmin.reason}" to "${editForm.reason}"`);
    }

    const updatedSubadmins = subadmins.map(subadmin => {
      if (subadmin.id === editingId) {
        const newChangeLog = changes.length > 0 ? [
          ...subadmin.changesLog,
          {
            date: new Date().toISOString().split('T')[0],
            change: changes.join('; '),
            reason: editForm.reason
          }
        ] : subadmin.changesLog;

        return {
          ...subadmin,
          email: editForm.email,
          password: editForm.password,
          reason: editForm.reason,
          changesLog: newChangeLog
        };
      }
      return subadmin;
    });

    setSubadmins(updatedSubadmins);
    setEditingId(null);
    setEditForm({});
  };

  const handleReasonChange = (reason, isEditing = false) => {
    if (isEditing) {
      setEditForm(prev => ({
        ...prev,
        reason: reason
      }));
    } else {
      setNewSubadmin(prev => ({
        ...prev,
        reason: reason
      }));
    }
  };

  const addSubadmin = () => {
    if (!newSubadmin.email || !newSubadmin.password) return;
    
    const newId = Math.max(...subadmins.map(s => s.id)) + 1;
    const newSubadminData = {
      id: newId,
      email: newSubadmin.email,
      password: newSubadmin.password,
      reason: newSubadmin.reason || 'No reason specified',
      changesLog: [
        {
          date: new Date().toISOString().split('T')[0],
          change: 'Initial creation',
          reason: newSubadmin.reason || 'No reason specified'
        }
      ]
    };

    setSubadmins([...subadmins, newSubadminData]);
    setNewSubadmin({ email: '', password: '', reason: '' });
    setShowAddForm(false);
  };

  const deleteSubadmin = (id) => {
    setSubadmins(subadmins.filter(s => s.id !== id));
  };

  return (
    <>
    <Customerfilter></Customerfilter>
    <div className="min-h-screen bg-gray-50 p-6">
      <div >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {showAddForm && (
            <div className="border-b bg-gray-50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newSubadmin.email}
                    onChange={(e) => setNewSubadmin(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={newSubadmin.password}
                    onChange={(e) => setNewSubadmin(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <select
                  value={newSubadmin.reason}
                  onChange={(e) => handleReasonChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a reason</option>
                  {availableReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
                {newSubadmin.reason === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter custom reason"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleReasonChange(e.target.value)}
                  />
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={addSubadmin}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Add Subadmin
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewSubadmin({ email: '', password: '', permissions: [] });
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subadmins.map((subadmin) => (
                  <React.Fragment key={subadmin.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {subadmin.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === subadmin.id ? (
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <span className="text-sm text-gray-900">{subadmin.email}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {editingId === subadmin.id ? (
                            <input
                              type="password"
                              value={editForm.password}
                              onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <>
                              <span className="text-sm text-gray-900">
                                {showPasswords[subadmin.id] ? subadmin.password : '••••••••'}
                              </span>
                              <button
                                onClick={() => togglePasswordVisibility(subadmin.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords[subadmin.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === subadmin.id ? (
                          <div className="space-y-2">
                            <select
                              value={editForm.reason}
                              onChange={(e) => handleReasonChange(e.target.value, true)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select a reason</option>
                              {availableReasons.map(reason => (
                                <option key={reason} value={reason}>{reason}</option>
                              ))}
                            </select>
                            {editForm.reason === 'Other' && (
                              <input
                                type="text"
                                placeholder="Enter custom reason"
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => handleReasonChange(e.target.value, true)}
                              />
                            )}
                          </div>
                        ) : (
                          <div className="max-w-xs">
                            <span className="text-sm text-gray-900 break-words">
                              {subadmin.reason}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {editingId === subadmin.id ? (
                            <>
                              <button
                                onClick={saveEdit}
                                className="text-green-600 hover:text-green-900 transition-colors"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(subadmin)}
                                className="text-indigo-600 hover:text-indigo-900 transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => toggleHistory(subadmin.id)}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                              >
                                <History size={16} />
                              </button>
                              <button
                                onClick={() => deleteSubadmin(subadmin.id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {showHistory[subadmin.id] && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 bg-gray-50">
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">Change History</h4>
                            <div className="space-y-2">
                              {subadmin.changesLog.map((log, index) => (
                                <div key={index} className="flex items-start space-x-3 text-sm">
                                  <span className="text-gray-500 min-w-0 flex-shrink-0">{log.date}</span>
                                  <span className="text-gray-700 flex-1">{log.change}</span>
                                  <div className="max-w-xs">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 break-words">
                                      {log.reason}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
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
      </div>
    </div>
    </>
  );
};

export default SubAdminPermission;