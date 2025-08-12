import { Trash2 } from 'lucide-react';
import Button from '../ui/Button';
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
        <div className="flex items-center mb-4">
          <Trash2 className="text-red-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">
            Confirm Deletion
          </h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete <span className="font-semibold">{itemName}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirmationModal;