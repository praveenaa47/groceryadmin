import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Calendar, 
  Shield, 
  Coins, 
  ShoppingCart, 
  Heart, 
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Smartphone,
  Gift
} from 'lucide-react';
import { getCustomerbyId } from '../api'; // Import your API function

const CustomerDetailPage = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get the customer ID from URL params
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Call your actual API
        const data = await getCustomerbyId(id);
        setCustomer(data);
        
      } catch (error) {
        console.error("Failed to fetch customer details:", error);
        setError("Failed to load customer details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomerDetails();
    } else {
      setError("No customer ID provided");
      setLoading(false);
    }
  }, [id]);

  const getStatusBadge = (status, isVerified) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    
    if (status === "active" && isVerified) {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (status === "active" && !isVerified) {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    } else {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
  };

  const getStatusText = (status, isVerified) => {
    if (status === "active" && isVerified) {
      return "Verified Active";
    } else if (status === "active" && !isVerified) {
      return "Pending Verification";
    } else {
      return "Inactive";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Customer Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "The requested customer could not be found."}</p>
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { user, cart, wishlist } = customer;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleGoBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
                <p className="text-sm text-gray-500">ID: {user._id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute inset-0 bg-yellow-200 bg-opacity-20"></div>
          </div>
          
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-white p-1 shadow-lg">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=random&color=fff`}
                    alt={user.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
              </div>
              
              <div className="mt-6 sm:mt-0 sm:flex-1 sm:min-w-0">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">{user.name}</h2>
                  {user.isVerified ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <Clock className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {user.number}
                  </span>
                  <span className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-1" />
                    {user.role}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {formatDate(user.createdAt)}
                  </span>
                </div>
                
                <div className="mt-4">
                  <span className={getStatusBadge(user.status, user.isVerified)}>
                    <Shield className="h-4 w-4 mr-1" />
                    {getStatusText(user.status, user.isVerified)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Coins className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Coins</p>
                <p className="text-2xl font-semibold text-gray-900">{user.coins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cart Items</p>
                <p className="text-2xl font-semibold text-gray-900">{cart.items.length}</p>
                <p className="text-xs text-gray-500">₹{cart.totalPrice}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Wishlist</p>
                <p className="text-2xl font-semibold text-gray-900">{wishlist.items.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Smartphone className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Devices</p>
                <p className="text-2xl font-semibold text-gray-900">{user.devices.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Account Information
            </h3>
            
            <div className="space-y-4">              
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Name</span>
                <span className="text-sm text-gray-900 capitalize">{user.name}</span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Phone Number</span>
                <span className="text-sm text-gray-900">{user.number}</span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Role</span>
                <span className="text-sm text-gray-900 capitalize">{user.role}</span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Verification Status</span>
                <span className={`text-sm ${user.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Account Status</span>
                <span className="text-sm text-gray-900 capitalize">{user.status}</span>
              </div>
            </div>
          </div>

          {/* Referral & Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              Referral & Activity
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Referral Code</span>
                <span className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                  {user.referralCode}
                </span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Referred By</span>
                <span className="text-sm text-gray-900">
                  {user.referredBy || 'Direct signup'}
                </span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Account Created</span>
                <span className="text-sm text-gray-900">{formatDate(user.createdAt)}</span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-900">{formatDate(user.updatedAt)}</span>
              </div>
              
              {user.otp && (
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">OTP Status</span>
                  <span className="text-sm text-yellow-600">
                    Expires: {formatDate(user.otpExpiresAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empty States for Cart and Wishlist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Shopping Cart
            </h3>
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Total: ₹{cart.totalPrice}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Wishlist
            </h3>
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No items in wishlist</p>
              <p className="text-sm text-gray-400 mt-1">{wishlist.items.length} items</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;