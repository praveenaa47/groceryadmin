import React, { useState, useRef, useEffect } from 'react';
import { Users, Shield, Eye, EyeOff, Plus, X, ChevronDown, Check } from 'lucide-react';

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    selectedPermissions: []
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dashboardSections = [
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'analytics', label: 'Analytics & Reports', icon: '📊' },
    { id: 'content', label: 'Content Management', icon: '📝' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' },
    { id: 'billing', label: 'Billing & Payments', icon: '💳' },
    { id: 'support', label: 'Customer Support', icon: '🎧' },
    { id: 'products', label: 'Product Management', icon: '📦' },
    { id: 'orders', label: 'Order Management', icon: '🛒' },
    { id: 'marketing', label: 'Marketing Tools', icon: '📢' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security & Logs', icon: '🔐' },
    { id: 'integration', label: 'API & Integrations', icon: '🔗' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionToggle = (sectionId) => {
    setFormData(prev => ({
      ...prev,
      selectedPermissions: prev.selectedPermissions.includes(sectionId)
        ? prev.selectedPermissions.filter(id => id !== sectionId)
        : [...prev.selectedPermissions, sectionId]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password || formData.selectedPermissions.length === 0) {
      alert('Please fill in all fields and select at least one permission.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Creating sub-admin:', formData);
      alert('Sub-admin created successfully!');
      setFormData({
        email: '',
        password: '',
        selectedPermissions: []
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const removePermission = (sectionId) => {
    setFormData(prev => ({
      ...prev,
      selectedPermissions: prev.selectedPermissions.filter(id => id !== sectionId)
    }));
  };

  const getSelectedPermissionsText = () => {
    if (formData.selectedPermissions.length === 0) {
      return "Select dashboard permissions";
    }
    if (formData.selectedPermissions.length === 1) {
      const section = dashboardSections.find(s => s.id === formData.selectedPermissions[0]);
      return `${section?.icon} ${section?.label}`;
    }
    return `${formData.selectedPermissions.length} permissions selected`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Add Sub Admin</h1>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter secure password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard Permissions */}
            <div>
              <div className="flex items-center mb-4">
                <Users className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Dashboard Permissions *</h3>
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 flex items-center justify-between ${
                    formData.selectedPermissions.length === 0 ? 'text-gray-500' : 'text-gray-900'
                  }`}
                >
                  <span>{getSelectedPermissionsText()}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? 'transform rotate-180' : ''
                  }`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {dashboardSections.map((section) => {
                      const isSelected = formData.selectedPermissions.includes(section.id);
                      return (
                        <div
                          key={section.id}
                          onClick={() => handlePermissionToggle(section.id)}
                          className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between transition-colors duration-150 ${
                            isSelected ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="text-lg mr-3">{section.icon}</span>
                            <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                              {section.label}
                            </span>
                          </div>
                          {isSelected && (
                            <Check className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Select All / Clear All Options */}
                    <div className="border-t border-gray-100 p-2 bg-gray-50">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            selectedPermissions: dashboardSections.map(s => s.id)
                          }))}
                          className="flex-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            selectedPermissions: []
                          }))}
                          className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Permissions Display */}
              {formData.selectedPermissions.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Selected Permissions ({formData.selectedPermissions.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedPermissions.map(permissionId => {
                      const section = dashboardSections.find(s => s.id === permissionId);
                      return (
                        <span
                          key={permissionId}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          <span className="mr-1">{section?.icon}</span>
                          {section?.label}
                          <button
                            type="button"
                            onClick={() => removePermission(permissionId)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {formData.selectedPermissions.length === 0 && (
                <p className="text-red-500 text-sm mt-2">Please select at least one dashboard permission.</p>
              )}
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.email || !formData.password || formData.selectedPermissions.length === 0}
                className={`
                  flex items-center px-8 py-3 rounded-lg font-medium transition duration-200
                  ${isSubmitting || !formData.email || !formData.password || formData.selectedPermissions.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Create Sub Admin
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;