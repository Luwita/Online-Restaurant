import React, { useState } from 'react';
import { X, Upload, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { categories } from '../data/menuData';
import { MenuItem } from '../types';

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMenuItemModal({ isOpen, onClose }: AddMenuItemModalProps) {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'appetizers',
    image: '',
    preparationTime: '',
    spicyLevel: '',
    dietary: [] as string[],
    allergens: [] as string[],
    ingredients: [] as string[],
    nutritionalInfo: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
    },
  });

  const [newIngredient, setNewIngredient] = useState('');
  const [newAllergen, setNewAllergen] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: MenuItem = {
      id: `custom_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
      available: true,
      preparationTime: parseInt(formData.preparationTime),
      spicyLevel: formData.spicyLevel as any || undefined,
      dietary: formData.dietary.length > 0 ? formData.dietary as any : undefined,
      allergens: formData.allergens.length > 0 ? formData.allergens : undefined,
      ingredients: formData.ingredients.length > 0 ? formData.ingredients : undefined,
      nutritionalInfo: formData.nutritionalInfo.calories ? {
        calories: parseInt(formData.nutritionalInfo.calories),
        protein: parseInt(formData.nutritionalInfo.protein),
        carbs: parseInt(formData.nutritionalInfo.carbs),
        fat: parseInt(formData.nutritionalInfo.fat),
      } : undefined,
      popularity: 3,
    };

    dispatch({ type: 'ADD_MENU_ITEM', payload: newItem });
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'appetizers',
      image: '',
      preparationTime: '',
      spicyLevel: '',
      dietary: [],
      allergens: [],
      ingredients: [],
      nutritionalInfo: {
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
      },
    });
    setNewIngredient('');
    setNewAllergen('');
  };

  const handleDietaryChange = (dietary: string) => {
    setFormData(prev => ({
      ...prev,
      dietary: prev.dietary.includes(dietary)
        ? prev.dietary.filter(d => d !== dietary)
        : [...prev.dietary, dietary]
    }));
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()]
      }));
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const addAllergen = () => {
    if (newAllergen.trim()) {
      setFormData(prev => ({
        ...prev,
        allergens: [...prev.allergens, newAllergen.trim()]
      }));
      setNewAllergen('');
    }
  };

  const removeAllergen = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-orange-600 text-white p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Add New Menu Item</h2>
            <button onClick={onClose} className="p-1 hover:bg-orange-700 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter item name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    placeholder="Describe the dish..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (K) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preparation Time (min) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.preparationTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="15"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Dietary & Spice Level */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Dietary & Spice Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spice Level
                  </label>
                  <select
                    value={formData.spicyLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, spicyLevel: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">No spice level</option>
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="hot">Hot</option>
                    <option value="very-hot">Very Hot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Options
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['vegetarian', 'vegan', 'gluten-free', 'halal'].map(dietary => (
                      <label key={dietary} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.dietary.includes(dietary)}
                          onChange={() => handleDietaryChange(dietary)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {dietary.replace('-', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Ingredients</h3>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Add ingredient"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                  />
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {formData.ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                      >
                        {ingredient}
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="ml-2 text-gray-500 hover:text-red-500"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Allergens */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Allergens</h3>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newAllergen}
                    onChange={(e) => setNewAllergen(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Add allergen"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
                  />
                  <button
                    type="button"
                    onClick={addAllergen}
                    className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {formData.allergens.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.allergens.map((allergen, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                      >
                        {allergen}
                        <button
                          type="button"
                          onClick={() => removeAllergen(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Nutritional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Nutritional Information (Optional)</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calories
                    </label>
                    <input
                      type="number"
                      value={formData.nutritionalInfo.calories}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        nutritionalInfo: { ...prev.nutritionalInfo, calories: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      value={formData.nutritionalInfo.protein}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        nutritionalInfo: { ...prev.nutritionalInfo, protein: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      value={formData.nutritionalInfo.carbs}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        nutritionalInfo: { ...prev.nutritionalInfo, carbs: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fat (g)
                    </label>
                    <input
                      type="number"
                      value={formData.nutritionalInfo.fat}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        nutritionalInfo: { ...prev.nutritionalInfo, fat: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Add Menu Item
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}