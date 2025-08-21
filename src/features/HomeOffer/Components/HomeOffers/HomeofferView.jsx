import React, { useState } from 'react';
import { Edit2, Trash2, Eye, MoreVertical, Search, Filter, Plus, Calendar, Tag, Play, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomeOfferView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDropdown, setShowDropdown] = useState(null);
  const [showGifModal, setShowGifModal] = useState(null);

  const homeOffers = [
    {
      id: 1,
      title: 'Summer Fresh Produce Sale',
      subtitle: 'Get the freshest vegetables at unbeatable prices',
      status: 'active',
      productsCount: 5,
      createdDate: '2024-01-15',
      backgroundImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
      hasGif: true,
      gifUrl: 'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif',
    },
    {
      id: 2,
      title: 'Organic Potato Collection',
      subtitle: 'Premium quality organic potatoes direct from farm',
      status: 'active',
      productsCount: 3,
      createdDate: '2024-01-12',
      backgroundImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
      hasGif: false,
      gifUrl: null,
    },
    {
      id: 3,
      title: 'Winter Harvest Special',
      subtitle: 'Seasonal vegetables at special prices',
      status: 'inactive',
      productsCount: 8,
      createdDate: '2024-01-08',
      backgroundImage: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400',
      hasGif: true,
      gifUrl: 'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif',
    },
    
    {
      id: 5,
      title: 'Healthy Living Bundle',
      subtitle: 'Complete nutrition package for health-conscious families',
      status: 'draft',
      productsCount: 4,
      createdDate: '2024-01-03',
      backgroundImage: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400',
      hasGif: true,
      gifUrl: 'https://media.giphy.com/media/3o7aCSPqXE5C6T8tBC/giphy.gif',
    }
  ];

  const filteredOffers = homeOffers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || offer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = (action, offerId) => {
    console.log(`${action} offer with ID:`, offerId);
    setShowDropdown(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  const navigate = useNavigate()

  const handlehomeOffer = ()=>{
    navigate('/add-home-offer')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl  font-bold text-gray-900">Home Offers</h1>
          </div>
          <button
          onClick={handlehomeOffer}
           className="mt-4 sm:mt-0 bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
            <Plus className="w-4 h-4" />
            <span>Add New Offer</span>
          </button>
        </div>
        {/* Offers Grid */}
        {filteredOffers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Get started by creating your first home offer.'
              }
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2 mx-auto">
              <Plus className="w-4 h-4" />
              <span>Create First Offer</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 overflow-hidden">
                {/* Image */}
                <div className="relative">
                  <img
                    src={offer.backgroundImage}
                    alt={offer.title}
                    className="w-full h-48 object-cover"
                  />
                  {offer.hasGif && (
                    <>
                      <div className="absolute top-3 left-3 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                        GIF
                      </div>
                      <button
                        onClick={() => setShowGifModal(offer)}
                        className="absolute bottom-3 left-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all shadow-md"
                      >
                        <Play className="w-4 h-4 text-gray-700" />
                      </button>
                    </>
                  )}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                    {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="relative ml-2">
                      
                      {showDropdown === offer.id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                          <button
                            onClick={() => handleAction('edit', offer.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleAction('delete', offer.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center space-x-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* GIF Modal */}
        {showGifModal && (
          <div className="fixed inset-0 bg-black bg-blackdrop-sm bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h3 className="font-semibold text-gray-900">{showGifModal.title}</h3>
                  <p className="text-sm text-gray-600">GIF Preview</p>
                </div>
                <button
                  onClick={() => setShowGifModal(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex justify-center">
                  <img
                    src={showGifModal.gifUrl}
                    alt={`${showGifModal.title} GIF`}
                    className="max-w-full max-h-96 object-contain rounded-lg"
                  />
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeOfferView;