// pages/ViewNotification.jsx
import React, { useState, useEffect } from 'react';
import { Bell, ShoppingCart, AlertTriangle, CheckCircle, CreditCard, Gift, Star, Truck, User } from 'lucide-react';
import { getAllNotifications } from '../api';
import { AddNotificationModal } from '../Components/Addnoti/AddNotifications';
import NotificationFilterBar from '../Components/Structure/NotificationFilterBar';
import NotificationTable from '../Components/Structure/NotificationTable';

const ViewNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const categories = ['all', 'unread', 'read', 'promo', 'order', 'inventory', 'delivery', 'payment', 'review', 'supplier', 'customer'];

  const handleAddNotification = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNotification = () => {
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getAllNotifications();
        const transformedNotifications = data.map(notification => ({
          id: notification._id,
          type: notification.notificationType,
          title: notification.title,
          description: notification.description,
          timestamp: formatTimestamp(notification.createdAt),
          isRead: notification.isRead,
          notificationType: "alert",
          category: notification.notificationType,
          actionUrl: `/notifications/${notification._id}`,
          image: notification.image,
          ownerId: notification.ownerId,
          role: notification.role,
          createdAt: notification.createdAt,
          updatedAt: notification.updatedAt
        }));
        
        setNotifications(transformedNotifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        
        if (err.message.includes('Authentication') || err.response?.status === 401) {
          setError('Authentication failed. Please login again.');
        } else if (err.response?.status === 403) {
          setError('Access denied. You do not have permission to view notifications.');
        } else {
          setError(err.message || 'Failed to load notifications');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const formatTimestamp = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMs = now - notificationDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${diffInDays} days ago`;
    }
  };

  const getIconByType = (type) => {
    switch (type) {
      case 'order': return ShoppingCart;
      case 'inventory': return AlertTriangle;
      case 'delivery': return CheckCircle;
      case 'payment': return CreditCard;
      case 'promo':
      case 'promotion': return Gift;
      case 'review': return Star;
      case 'supplier': return Truck;
      case 'customer': return User;
      default: return Bell;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'order': return 'bg-green-500';
      case 'inventory': return 'bg-yellow-500';
      case 'delivery': return 'bg-blue-500';
      case 'payment': return 'bg-purple-500';
      case 'promo':
      case 'promotion': return 'bg-pink-500';
      case 'review': return 'bg-indigo-500';
      case 'supplier': return 'bg-teal-500';
      case 'customer': return 'bg-cyan-500';
      default: return 'bg-gray-500';
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notif.isRead) ||
      (filter === 'read' && notif.isRead) ||
      notif.category === filter;
    
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <NotificationFilterBar
          filter={filter}
          setFilter={setFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          unreadCount={unreadCount}
          onAddNotification={handleAddNotification}
          categories={categories}
        />
        
        <NotificationTable
          notifications={filteredNotifications}
          onMarkAsRead={markAsRead}
          onDeleteNotification={deleteNotification}
          loading={loading}
          getTypeColor={getTypeColor}
          getIconByType={getIconByType}
        />
      </div>
      
      <AddNotificationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNotification}
      />
    </div>
  );
};

export default ViewNotification;