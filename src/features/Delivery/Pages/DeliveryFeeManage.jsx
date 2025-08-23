import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { createDeliveryfee, deleteDeliveryfee, getDeliveryfee, updateDeliveryfee } from '../api';
import { toast, Toaster } from 'sonner';
import DeleteConfirmationModal from '../../../Components/shared/DeleteModal';
import DeliveryFeeHeader from '../Components/DeliveryInfo/DeliveryFeeHeader';
import DeliveryFeeTable from '../Components/DeliveryInfo/DeliveryFeeTable';
import DeliveryFeeForm from '../Components/DeliveryInfo/DeliveryFeeForm';

const DeliveryFeeManage = () => {
  const [deliveryFees, setDeliveryFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [deliveryToDelete, setDeliveryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    minAmount: '',
    maxAmount: '',
    charge: ''
  });

  const fetchDeliveryFees = async () => {
    try {
      const response = await getDeliveryfee();
      setDeliveryFees(response.data);
    } catch (error) {
      setError('Error fetching delivery fees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryFees();
  }, []);

  const handleAdd = () => {
    setEditingFee(null);
    setFormData({ minAmount: '', maxAmount: '', charge: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (fee) => {
    setEditingFee(fee);
    setFormData({
      minAmount: fee.minAmount.toString(),
      maxAmount: fee.maxAmount.toString(),
      charge: fee.charge.toString()
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (delivery) => {
    setDeliveryToDelete(delivery);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteDeliveryfee(deliveryToDelete._id); 
      setDeliveryFees(prevFees => prevFees.filter(f => f._id !== deliveryToDelete._id));
      toast.success("Delivery fee deleted successfully!");
    } catch (error) {
      toast.error("Error deleting delivery fee");
    } finally {
      setIsDeleteModalOpen(false);
      setDeliveryToDelete(null);
    }
  };

  const handleSubmit = async () => {
    if (!formData.minAmount || !formData.maxAmount || !formData.charge) {
      toast.warning('Please fill in all fields');
      return;
    }

    if (parseInt(formData.maxAmount) <= parseInt(formData.minAmount)) {
      toast.warning('Maximum amount should be greater than minimum amount');
      return;
    }

    const feeData = {
      minAmount: parseInt(formData.minAmount),
      maxAmount: parseInt(formData.maxAmount),
      charge: parseInt(formData.charge),
    };

    try {
      setSubmitting(true);

      if (editingFee) {
        const response = await updateDeliveryfee(editingFee._id, feeData);

        if (response.success) {
          setDeliveryFees(prevFees =>
            prevFees.map(fee =>
              fee._id === editingFee._id ? response.data : fee
            )
          );
          toast.success(response.message || 'Delivery fee updated successfully!');
        }
      } else {
        await createNewDeliveryFee(feeData);
      }

      setIsModalOpen(false);
      setFormData({ minAmount: '', maxAmount: '', charge: '' });
      setEditingFee(null);

    } catch (error) {
      toast.error('Error saving delivery fee. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const createNewDeliveryFee = async (feeData) => {
    try {
      setSubmitting(true);
      const response = await createDeliveryfee(feeData);
      
      if (response.success) {
        setDeliveryFees(prevFees => [...prevFees, response.data]);
        setIsModalOpen(false);
        setFormData({ minAmount: '', maxAmount: '', charge: '' });
        toast.success(response.message || 'Delivery fee added successfully!');
      }
    } catch (error) {
      toast.error('Error creating delivery fee. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div>
        <DeliveryFeeHeader title="Delivery Fee" onAdd={handleAdd} />

        {!loading && !error && (
          <DeliveryFeeTable
            deliveryFees={deliveryFees}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onRefresh={fetchDeliveryFees}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            formatDate={formatDate}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading delivery fees...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-center text-red-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
              <button
                onClick={fetchDeliveryFees}
                className="ml-4 text-blue-600 hover:text-blue-800 underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>

      <DeliveryFeeForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        onInputChange={handleInputChange}
        editingFee={editingFee}
        submitting={submitting}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="This Record"
      />
      
      <Toaster position='top-right' richColors/>
    </div>
  );
};

export default DeliveryFeeManage;