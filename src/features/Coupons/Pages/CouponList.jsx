import React from 'react'
import CouponFilter from '../Components/CouponFilter/CouponFilter'
import CouponInfo from '../Components/CouponFilter/CouponInfo'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


function CouponList() {
  const navigate = useNavigate()
  const handleaddcoupon = () => {
    navigate('/addcoupon')
  }
  return (
    <div>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl text-center font-bold text-gray-900">All Coupons</h1>
          </div>
          <button 
          onClick={handleaddcoupon}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Coupon
          </button>
        </div> 
       <CouponFilter></CouponFilter>
       <CouponInfo></CouponInfo>
    </div>
  )
}

export default CouponList
