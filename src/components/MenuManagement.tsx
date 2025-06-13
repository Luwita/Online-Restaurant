import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit, Eye, EyeOff, Search, Filter, Trash2, Copy } from 'lucide-react';
import { categories } from '../data/menuData';
import AddMenuItemModal from './AddMenuItemModal';

export default function MenuManagement() {
  const { state, dispatch } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredItems = state.menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleAvailability = (itemId: string) => {
    dispatch({ type: 'TOGGLE_MENU_ITEM_AVAILABILITY', payload: itemId });
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleBulkToggleAvailability = () => {
    selectedItems.forEach(itemId => {
      dispatch({ type: 'TOGGLE_MENU_ITEM_AVAILABILITY', payload: itemId });
    });
    setSelectedItems([]);
  };

  const handleDuplicateItem = (item: any) => {
    const duplicatedItem = {
      ...item,
      id: `${item.id}_copy_${Date.now()}`,
      name: `${item.name} (Copy)`,
    };
    dispatch({ type: 'ADD_MENU_ITEM', payload: duplicatedItem });
  };

  const categoryStats = categories.map(category => {
    const categoryItems = state.menuItems.filter(item => item.category === category.id);
    const availableItems = categoryItems.filter(item => item.available);
    return {
      ...category,
      total: categoryItems.length,
      available: availableItems.length,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Menu Management</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage your menu items, availability, and pricing
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {categoryStats.map(category => (
          <div key={category.id} className="bg-white border rounded-lg p-3 text-center">
            <div className="text-lg mb-1">{category.icon}</div>
            <div className="text-xs font-medium text-gray-900">{category.name}</div>
            <div className="text-xs text-gray-600">
              {category.available}/{category.total}
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-orange-800">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkToggleAvailability}
                className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors"
              >
                Toggle Availability
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prep Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {categories.find(c => c.id === item.category)?.name}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                    K{item.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {item.preparationTime} min
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`p-1 rounded transition-colors ${
                          item.available
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                        title={item.available ? 'Mark as unavailable' : 'Mark as available'}
                      >
                        {item.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      
                      <button 
                        onClick={() => handleDuplicateItem(item)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Duplicate item"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      
                      <button className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium mb-2">No items found</p>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Add Menu Item Modal */}
      <AddMenuItemModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
    </div>
  );
}