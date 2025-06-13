import React, { useState } from 'react';
import { Store, MapPin, Star, Clock, Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface RestaurantSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockRestaurants = [
  {
    id: 'rest_1',
    name: 'Lusaka Intercontinental',
    description: 'Fine dining with international cuisine',
    address: 'Cairo Road, Lusaka CBD',
    rating: 4.8,
    reviewCount: 1234,
    priceRange: '$$$',
    cuisine: ['International', 'African', 'Continental'],
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=600',
    deliveryTime: '25-35 min',
    deliveryFee: 15,
    isOpen: true,
  },
  {
    id: 'rest_2',
    name: 'Zambezi Grill',
    description: 'Traditional Zambian cuisine',
    address: 'Manda Hill, Lusaka',
    rating: 4.6,
    reviewCount: 892,
    priceRange: '$$',
    cuisine: ['Zambian', 'African', 'Grill'],
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    deliveryTime: '20-30 min',
    deliveryFee: 12,
    isOpen: true,
  },
  {
    id: 'rest_3',
    name: 'Spice Route',
    description: 'Authentic Indian flavors',
    address: 'Arcades Shopping Centre',
    rating: 4.7,
    reviewCount: 567,
    priceRange: '$$',
    cuisine: ['Indian', 'Asian', 'Vegetarian'],
    image: 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=600',
    deliveryTime: '30-40 min',
    deliveryFee: 18,
    isOpen: false,
  },
];

export default function RestaurantSelector({ isOpen, onClose }: RestaurantSelectorProps) {
  const { dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');

  const handleRestaurantSelect = (restaurantId: string) => {
    dispatch({ type: 'SET_CURRENT_RESTAURANT', payload: restaurantId });
    onClose();
  };

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCuisine = selectedCuisine === 'all' || restaurant.cuisine.includes(selectedCuisine);
    return matchesSearch && matchesCuisine;
  });

  const allCuisines = Array.from(new Set(mockRestaurants.flatMap(r => r.cuisine)));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Choose Restaurant</h2>
                <p className="text-blue-100">Select from our partner restaurants</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <Store className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-white/20">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search restaurants or cuisine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Cuisines</option>
                {allCuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Restaurant List */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <button
                  key={restaurant.id}
                  onClick={() => handleRestaurantSelect(restaurant.id)}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 text-left group"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                          {restaurant.name}
                        </h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          restaurant.isOpen 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {restaurant.isOpen ? 'Open' : 'Closed'}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">{restaurant.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-400 mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{restaurant.rating}</span>
                          <span>({restaurant.reviewCount})</span>
                        </div>
                        <span>{restaurant.priceRange}</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{restaurant.deliveryTime}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {restaurant.cuisine.slice(0, 3).map(cuisine => (
                            <span
                              key={cuisine}
                              className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30"
                            >
                              {cuisine}
                            </span>
                          ))}
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">Delivery</div>
                          <div className="text-sm font-medium text-white">K{restaurant.deliveryFee}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 mt-2 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{restaurant.address}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {filteredRestaurants.length === 0 && (
              <div className="text-center py-12">
                <Store className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No restaurants found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}