import React from 'react'
import OrderFilter from '../components/OrderFilter'
import OrderTable from '../components/OrderTable'
import {  ShoppingCart } from 'lucide-react'

function OrderList() {
  return (
    <div>
        <div className="bg-white shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <ShoppingCart className="w-6 h-6" />
                Grocery Orders
              </h1>
            </div>
           
          </div>
        </div>
      </div>
      <OrderFilter></OrderFilter>
      <OrderTable></OrderTable>

      
    </div>
  )
}

export default OrderList
