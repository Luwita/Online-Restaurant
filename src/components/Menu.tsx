import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/menuData';
import MenuCard from './MenuCard';
import Cart from './Cart';
import SearchAndFilter from './SearchAndFilter';
import { ShoppingCart, ArrowLeft, Search, Filter, Star, Clock, TrendingUp, Award, Package, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Menu() {
  const { state } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('appetizers');
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    let items = state.menuItems.filter(
      item => item.category === selectedCategory && item.available
    );

    // Apply search filter
    if (state.searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        item.ingredients?.some(ingredient => 
          ingredient.toLowerCase().includes(state.searchQuery.toLowerCase())
        )
      );
    }

    // Apply dietary filters
    if (state.selectedFilters.dietary.length > 0) {
      items = items.filter(item =>
        item.dietary?.some(diet => state.selectedFilters.dietary.includes(diet))
      );
    }

    // Apply spicy level filters
    if (state.selectedFilters.spicyLevel.length > 0) {
      items = items.filter(item =>
        item.spicyLevel && state.selectedFilters.spicyLevel.includes(item.spicyLevel)
      );
    }

    // Apply price range filter
    items = items.filter(item =>
      item.price >= state.selectedFilters.priceRange[0] &&
      item.price <= state.selectedFilters.priceRange[1]
    );

    // Sort by popularity
    return items.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }, [state.menuItems, selectedCategory, state.searchQuery, state.selectedFilters]);

  const cartItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const activeFiltersCount = 
    state.selectedFilters.dietary.length + 
    state.selectedFilters.spicyLevel.length + 
    (state.selectedFilters.priceRange[0] > 0 || state.selectedFilters.priceRange[1] < 200 ? 1 : 0);

  const popularItems = filteredItems.filter(item => item.popularity && item.popularity >= 4);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="glass sticky top-0 z-40 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="btn-secondary flex items-center space-x-2 hover-lift"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Back</span>
            </button>
            
            <div className="text-center flex-1 px-2">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-glow">
                Our Menu
              </h1>
              {state.currentTableNumber && (
                <div className="flex items-center justify-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs sm:text-sm text-gray-300 font-medium">Table {state.currentTableNumber}</p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setShowFilters(true)}
                className="relative btn-secondary p-2 hover-scale"
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold animate-pulse">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowCart(true)}
                className="relative btn-primary p-2 sm:p-3 hover-lift animate-pulse-glow"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold animate-bounce">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Summary Bar */}
      {cartItemsCount > 0 && (
        <div className="glass-dark border-b border-white/20 animate-slide-up">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-1">
                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                <span className="text-xs sm:text-sm font-medium text-white">
                  {cartItemsCount} item{cartItemsCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="w-px h-3 sm:h-4 bg-white/30"></div>
              <span className="text-sm sm:text-lg font-bold text-white">K{cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="btn-primary text-xs sm:text-sm hover-scale"
            >
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="glass-card mx-3 sm:mx-4 lg:mx-6 mt-4 mb-4">
        <div className="flex space-x-1 overflow-x-auto py-3 sm:py-4 scrollbar-hide">
          {categories.filter(cat => cat.available).map((category, index) => {
            const categoryItems = state.menuItems.filter(
              item => item.category === category.id && item.available
            );
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 animate-slide-right ${
                  selectedCategory === category.id
                    ? 'bg-white text-black shadow-medium scale-105'
                    : 'glass text-gray-300 hover:text-white border border-white/20'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="mr-1 sm:mr-2 text-sm sm:text-lg">{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                <span className="ml-1 sm:ml-2 text-xs opacity-75 bg-white/20 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  {categoryItems.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Description & Stats */}
      <div className="glass-card mx-3 sm:mx-4 lg:mx-6 mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 p-4">
          <div className="text-center sm:text-left">
            {categories.find(cat => cat.id === selectedCategory)?.description && (
              <p className="text-white font-medium text-sm sm:text-base">
                {categories.find(cat => cat.id === selectedCategory)?.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-6 text-xs sm:text-sm">
            {popularItems.length > 0 && (
              <div className="flex items-center space-x-1 text-white">
                <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">{popularItems.length} Popular</span>
              </div>
            )}
            <div className="flex items-center space-x-1 text-white">
              <Package className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">{filteredItems.length} Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Items Banner */}
      {popularItems.length > 0 && (
        <div className="glass-card mx-3 sm:mx-4 lg:mx-6 mb-6">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <h3 className="text-base sm:text-lg font-semibold text-white">Most Popular</h3>
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {popularItems.slice(0, 5).map((item, index) => (
                <div 
                  key={item.id} 
                  className="flex-shrink-0 glass rounded-lg p-2 sm:p-3 border border-white/20 min-w-[160px] sm:min-w-[200px] hover-lift animate-slide-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-xs sm:text-sm truncate">{item.name}</h4>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <span className="text-white font-bold text-xs sm:text-sm">K{item.price.toFixed(2)}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-2 h-2 sm:w-3 sm:h-3 text-white fill-current" />
                          <span className="text-xs text-gray-300">{item.popularity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 sm:py-16">
            <div className="glass-card p-6 sm:p-8 max-w-md mx-auto">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No items found</h3>
              <p className="text-gray-300 mb-4 text-sm sm:text-base">
                {state.searchQuery || activeFiltersCount > 0
                  ? 'Try adjusting your search or filters'
                  : 'No items available in this category'}
              </p>
              {(state.searchQuery || activeFiltersCount > 0) && (
                <button
                  onClick={() => {
                    // Clear filters logic would go here
                  }}
                  className="btn-primary hover-lift"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredItems.map((item, index) => (
                <div 
                  key={item.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <MenuCard item={item} />
                </div>
              ))}
            </div>

            {/* Load More Button (if needed) */}
            {filteredItems.length > 12 && (
              <div className="text-center mt-8 sm:mt-12">
                <button className="btn-primary px-6 sm:px-8 py-3 rounded-full font-semibold hover-lift text-sm sm:text-base">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Load More Items</span>
                  </div>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Search and Filter Modal */}
      <SearchAndFilter 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)} 
      />

      {/* Cart Sidebar */}
      <Cart isOpen={showCart} onClose={() => setShowCart(false)} />

      {/* Offline Indicator */}
      {!state.isOnline && (
        <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 glass-dark rounded-lg shadow-strong max-w-xs animate-slide-up">
          <div className="flex items-center space-x-2 p-3 sm:p-4">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <p className="text-xs sm:text-sm font-medium text-white">You're offline. Orders will be saved locally.</p>
          </div>
        </div>
      )}
    </div>
  );
}