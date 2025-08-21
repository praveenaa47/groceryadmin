import React, { useState } from 'react';
import { Bell, Trash2 } from 'lucide-react';
import DeleteConfirmationModal from '../../../../Components/shared/DeleteModal';
import { toast, Toaster } from 'sonner';
import { deleteNotifications } from '../../api';


const NotificationTable = ({
  notifications,
  onMarkAsRead,
  onDeleteNotification, 
  loading,
  getTypeColor,
  getIconByType
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notificationDelete, setNotificationDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (id) => {
    setNotificationDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!notificationDelete) return;

    try {
      setDeleting(true);
      await deleteNotifications(notificationDelete);
      toast.success("Notification deleted successfully");
      if (onDeleteNotification) {
        onDeleteNotification(notificationDelete);
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete notification");
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setNotificationDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notifications found
          </h3>
        </div>
      ) : (
        notifications.map((notification) => {
          const IconComponent = getIconByType(notification.type);
          return (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md ${
                !notification.isRead
                  ? "border-l-4 border-l-blue-500 bg-blue-50/30"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div
                    className={`p-2 rounded-lg ${getTypeColor(
                      notification.type
                    )} bg-opacity-10`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full ${getTypeColor(
                        notification.type
                      )}`}
                    >
                      <IconComponent className="w-5 h-5 text-white p-0.5" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3
                        className={`text-lg font-semibold ${
                          !notification.isRead
                            ? "text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {notification.notificationType && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full border bg-gray-100 text-gray-800 border-gray-200">
                          {notification.notificationType}
                        </span>
                      )}
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-3">
                      {notification.description}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-500">
                        {notification.timestamp}
                      </span>

                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteClick(notification.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors ml-4"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="This Record"
        loading={deleting} 
      />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default NotificationTable;
