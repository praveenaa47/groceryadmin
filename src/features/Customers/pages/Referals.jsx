import React, { useEffect, useState } from 'react';
import { Edit3, Check, X } from 'lucide-react';
import { addreferal, getreferal } from '../api';
import { toast, Toaster } from 'sonner';

export default function ReferralPointsManager() {
  const [globalPoints, setGlobalPoints] = useState(100);
  const [isEditing, setIsEditing] = useState(false);
  const [tempPoints, setTempPoints] = useState(100);
  const [referalpoints, setReferalpoints] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch referral points on component mount
  useEffect(() => {
    const fetchReferalPoints = async () => {
      try {
        setLoading(true);
        const data = await getreferal();
        setReferalpoints(data);
        const points = data.referralBonus || 100; // Using referralBonus from API response
        setGlobalPoints(points);
        setTempPoints(points);
        setError('');
      } catch (error) {
        console.error("Error fetching referal points", error);
        setError('Failed to fetch referral points');
      } finally {
        setLoading(false);
      }
    };

    fetchReferalPoints();
  }, []); // Empty dependency array to run only on mount

  const handleSave = async () => {
    if (tempPoints > 0) {
      try {
        setLoading(true);
        setError('');
        const reqBody = {
          referralBonus: tempPoints,
          purchaseRate: referalpoints?.purchaseRate || 0,
          redemptionRate: referalpoints?.redemptionRate || 0
        };
        
        const response = await addreferal(reqBody);
        
        if (response.success) {
          setGlobalPoints(tempPoints);
          setIsEditing(false);
          setReferalpoints(response.settings);
          toast.success('Referral points updated successfully');
        } else {
          setError('Failed to update referral points');
        }
      } catch (error) {
        console.error("Error saving referal points", error);
        setError('Failed to save referral points');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Points must be greater than 0');
    }
  };

  const handleCancel = () => {
    setTempPoints(globalPoints);
    setIsEditing(false);
    setError('');
  };

  const handleEdit = () => {
    setTempPoints(globalPoints);
    setIsEditing(true);
    setError('');
  };

  if (loading && !isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white">Points Per Referral</h2>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 text-center">{error}</p>
              </div>
            )}

            {!isEditing ? (
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
                    <span className="text-4xl font-bold text-gray-800">{globalPoints}</span>
                  </div>
                  <p className="text-xl text-gray-600">Points per referral code</p>
                </div>
                
                <button
                  onClick={handleEdit}
                  disabled={loading}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit3 className="w-5 h-5 mr-2" />
                  Edit Points
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points Per Referral Code
                  </label>
                  <input
                    type="number"
                    value={tempPoints}
                    onChange={(e) => setTempPoints(parseInt(e.target.value) || 0)}
                    min="1"
                    max="10000"
                    className="w-full px-6 py-4 text-2xl text-center border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter points"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Check className="w-5 h-5 mr-2" />
                    )}
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-md border border-gray-100">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
            <span className="text-gray-700 font-medium">
              Current setting: {globalPoints} points per referral
            </span>
          </div>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}