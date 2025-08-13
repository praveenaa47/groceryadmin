import React from 'react'
import DealFilter from '../Components/DealInfo/DealFilter'
import DealList from '../Components/DealInfo/DealList'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


function DealPage() {
  const navigate = useNavigate()
  const handleaddDeal = () => {
    navigate('/add-dealpage')
  }
  return (
    <div>

        <div className="mb-6 flex justify-end">
          <button
            onClick={handleaddDeal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex  gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Offer 
          </button>
        </div>
        <DealFilter></DealFilter>
        <DealList></DealList>
    </div>
  )
}

export default DealPage
