import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const CouponInfo = ({
  coupons: initialCoupons = [],
  onEdit = () => {},
  onDelete = () => {}
}) => {
  const defaultCoupons = [
    {
      id: 1,
      code: "SAVE20",
      discountType: "percentage",
      discountValue: 20,
      minAmount: 100,
      maxDiscount: 50,
      expiryDate: "2024-12-31",
      status: "active",
      usageCount: 25,
      usageLimit: 100
    },
    {
      id: 2,
      code: "FLAT50",
      discountType: "fixed",
      discountValue: 50,
      minAmount: 200,
      maxDiscount: 50,
      expiryDate: "2024-11-30",
      status: "active",
      usageCount: 12,
      usageLimit: 50
    },
    {
      id: 3,
      code: "WELCOME10",
      discountType: "percentage",
      discountValue: 10,
      minAmount: 0,
      maxDiscount: 25,
      expiryDate: "2024-10-15",
      status: "expired",
      usageCount: 150,
      usageLimit: 200
    },
    {
      id: 4,
      code: "SUMMER25",
      discountType: "percentage",
      discountValue: 25,
      minAmount: 150,
      maxDiscount: 75,
      expiryDate: "2024-09-30",
      status: "inactive",
      usageCount: 0,
      usageLimit: 75
    },
    {
      id: 5,
      code: "FIRST100",
      discountType: "fixed",
      discountValue: 100,
      minAmount: 500,
      maxDiscount: 100,
      expiryDate: "2025-01-31",
      status: "active",
      usageCount: 5,
      usageLimit: 20
    }
  ];

  const [coupons, setCoupons] = useState(initialCoupons.length > 0 ? initialCoupons : defaultCoupons);

  const handleEdit = (coupon) => {
    onEdit(coupon);
  };

  const handleDelete = (coupon) => {
    if (window.confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) {
      setCoupons(prev => prev.filter(c => c.id !== coupon.id));
      onDelete(coupon);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDiscount = (type, value) => {
    return type === 'percentage' ? `${value}%` : `$${value}`;
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
               
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Amount
                </th>
      
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry
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
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{coupon.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDiscount(coupon.discountType, coupon.discountValue)}
                    </div>
                    {coupon.maxDiscount && (
                      <div className="text-xs text-gray-500">
                        Max: ₹{coupon.maxDiscount}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{coupon.minAmount}
                  </td>
                
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(coupon.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="Edit coupon"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Delete coupon"
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
      </div>
    </div>
  );
};

export default CouponInfo;