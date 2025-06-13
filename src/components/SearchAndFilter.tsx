import React, { useState } from 'react';
import { X, Search, Filter, RotateCcw, Sliders, Star, Clock, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SearchAndFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchAndFilter({ isOpen, onClose }: SearchAndFilterProps) {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'search' | 'filters' | 'sort'>('search');

  const handleSearchChange = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const handleDietaryFilter = (dietary: string) => {
    const current = state.selectedFilters.dietary;
    const updated = current.includes(dietary)
      ? current.filter(d => d !== dietary)
      : [...current, dietary];
    dispatch({ type: 'SET_FILTERS', payload: { dietary: updated } });
  };

  const handleSpicyFilter = (level: string) => {
    const current = state.selectedFilters.spicyLevel;
    const updated = current.includes(level)
      ? current.filter(l => l !== level)
      : [...current, level];
    dispatch({ type: 'SET_FILTERS', payload: { spicyLevel: updated } });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    dispatch({ type: 'SET_FILTERS', payload: { priceRange: [min, max] } });
  };

  const clearAllFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const activeFiltersCount = 
    state.selectedFilters.dietary.length + 
    state.selectedFilters.spicyLevel.length + 
    (state.selectedFilters.priceRange[0] > 0 || state.selectedFilters.priceRange[1] < 200 ? 1 : 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sliders className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Search & Filter</h2>
                {activeFiltersCount > 0 && (
                  <p className="text-orange-100 text-sm">{activeFiltersCount} active filters</p>
                )}
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Enhanced Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="flex">
              {[
                { id: 'search', label: 'Search', icon: Search },
                { id: 'filters', label: 'Filters', icon: Filter },
                { id: 'sort', label: 'Sort', icon: Star },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-3 font-medium text-sm transition-all duration-200 ${
                    activeTab === id
                      ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Search Tab */}
            {activeTab === 'search' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Search Menu Items
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={state.searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="Search dishes, ingredients..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                    />
                  </div>
                  {state.searchQuery && (
                    <div className="mt-2 text-sm text-gray-600">
                      Searching for: <span className="font-medium text-orange-600">"{state.searchQuery}"</span>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                  <h4 className="font-semibold text-gray-800 mb-2">Search Tips</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Try searching by dish name</li>
                    <li>• Look for specific ingredients</li>
                    <li>• Search by cuisine type</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Filters Tab */}
            {activeTab === 'filters' && (
              <div className="space-y-6">
                {/* Dietary Preferences */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Dietary Preferences
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['vegetarian', 'vegan', 'gluten-free', 'halal'].map((dietary) => (
                      <label key={dietary} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={state.selectedFilters.dietary.includes(dietary)}
                          onChange={() => handleDietaryFilter(dietary)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-3"
                        />
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {dietary.replace('-', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Spice Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Spice Level
                  </label>
                  <div className="space-y-3">
                    {[
                      { id: 'mild', label: 'Mild', color: 'text-green-600' },
                      { id: 'medium', label: 'Medium', color: 'text-yellow-600' },
                      { id: 'hot', label: 'Hot', color: 'text-orange-600' },
                      { id: 'very-hot', label: 'Very Hot', color: 'text-red-600' },
                    ].map(({ id, label, color }) => (
                      <label key={id} className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={state.selectedFilters.spicyLevel.includes(id)}
                          onChange={() => handleSpicyFilter(id)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-3"
                        />
                        <span className={`text-sm font-medium ${color}`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Price Range
                  </label>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-600">
                        K{state.selectedFilters.priceRange[0]}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        K{state.selectedFilters.priceRange[1]}
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Minimum Price</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={state.selectedFilters.priceRange[0]}
                          onChange={(e) => handlePriceRangeChange(
                            parseInt(e.target.value), 
                            state.selectedFilters.priceRange[1]
                          )}
                          className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Maximum Price</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={state.selectedFilters.priceRange[1]}
                          onChange={(e) => handlePriceRangeChange(
                            state.selectedFilters.priceRange[0], 
                            parseInt(e.target.value)
                          )}
                          className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sort Tab */}
            {activeTab === 'sort' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Sort Options</h3>
                {[
                  { id: 'popularity', label: 'Most Popular', icon: Star },
                  { id: 'price-low', label: 'Price: Low to High', icon: DollarSign },
                  { id: 'price-high', label: 'Price: High to Low', icon: DollarSign },
                  { id: 'prep-time', label: 'Preparation Time', icon: Clock },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all text-left"
                  >
                    <Icon className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-gray-700">{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className="border-t bg-white p-6 space-y-3">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear All Filters</span>
              </button>
            )}
            
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-200 transform hover:scale-105"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}