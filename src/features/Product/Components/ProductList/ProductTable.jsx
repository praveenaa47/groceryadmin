import React, { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import image2 from "../../../../assets/veg2.jpeg";
import image3 from "../../../../assets/veg3.jpeg";
import image4 from "../../../../assets/veg4.jpeg";
import image5 from "../../../../assets/veg5.jpeg";
import image6 from "../../../../assets/veg6.jpeg";
import DeleteConfirmationModal from "../../../../Components/shared/DeleteModal";
import { useNavigate } from "react-router-dom";


const ProductTable = () => {
  const [products] = useState([
    { id: "6221568yedb89bcd", name: "Onion", image: image2, price: 299.99, stock: 23, weight: "0.05kg" },
    { id: "6221568yedb89bcd", name: "Cabbage", image:image3,  price: 89.99, stock: 67, weight: "1.2kg" },
    { id: "6221568yedb89bcd", name: "Star fruit", image:image4 , price: 45.99, stock: 12, weight: "0.15kg" },
    { id: "6221568yedb89bcd", name: "Avacado", image: image5 , price: 159.99, stock: 8, weight: "1.1kg" },
    { id: "6221568yedb89bcd", name: "Grapes", image:image6 , price: 39.99, stock: 34, weight: "0.12kg" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteProduct, setDeleteproduct] = useState(false);

    const handleConfirmDelete = () => {
    console.log('Delete confirmed for category ID:', deleteProduct);
    setIsModalOpen(false);
  }
   const handleDeleteClick = (id) => {
    setDeleteproduct(id);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStock = true;
    if (stockFilter === "low") matchesStock = product.stock <= 10;
    else if (stockFilter === "medium") matchesStock = product.stock > 10 && product.stock <= 25;
    else if (stockFilter === "high") matchesStock = product.stock > 25;

    let matchesPrice = true;
    if (priceFilter === "under50") matchesPrice = product.price < 50;
    else if (priceFilter === "50to100") matchesPrice = product.price >= 50 && product.price < 100;
    else if (priceFilter === "100to200") matchesPrice = product.price >= 100 && product.price < 200;
    else if (priceFilter === "over200") matchesPrice = product.price >= 200;

    return matchesSearch && matchesStock && matchesPrice;
  });

  const handleEdit = (id) => alert(`Edit product: ${id}`);
  const getStockStatus = (stock) => {
    if (stock <= 10) return "text-red-600 bg-red-50";
    if (stock <= 25) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };
  const navigate = useNavigate();
  const handleRowClick = (id)=>{
    navigate(`/productsingle/${id}`)
  }

   return (
    <div className="min-h-screen bg-gray-50 ">
      <div className=" mx-auto ">    
         
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product NAME</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <tr key={product.id} 
                  onClick={() => handleRowClick(product.id)}
                  className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/80x80")}
                      />
                      <span className="ml-4 text-sm font-medium text-gray-900 truncate">{product.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono  px-2 py-1 rounded">{product.id}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold"> ₹{product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStockStatus(product.stock)}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">{product.weight}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button onClick={() => handleEdit(product.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={handleDeleteClick} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-2">No products found</p>
              <p className="text-gray-500 text-sm">
                {searchTerm || stockFilter !== "all" || priceFilter !== "all"
                  ? "Try adjusting your search criteria or filters"
                  : "Add your first product to get started"}
              </p>
            </div>
          )}
        </div>
      </div>
        <DeleteConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName="This Record"
        />
    </div>
  );
};

export default ProductTable;
