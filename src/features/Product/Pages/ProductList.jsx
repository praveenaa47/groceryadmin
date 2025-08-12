import React from 'react'
import ProductFilters from '../Components/ProductList/ProductFilters'
import ProductTable from '../Components/ProductList/ProductTable'
import Pagination from '../../../Components/shared/Pagination'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


function ProductList() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const navigate = useNavigate();
    const handleAddproduct = () => {
        navigate('/addproduct');
    };
  const totalPages = 10;
  return (
    <div>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl text-center font-bold text-gray-900">All Products</h1>
          </div>
          <button 
          onClick={handleAddproduct} className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>  
        <ProductFilters></ProductFilters>
        <ProductTable></ProductTable>
          <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  )
}

export default ProductList
