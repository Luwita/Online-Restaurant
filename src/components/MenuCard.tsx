import React, { useState } from 'react';
import { Plus, Minus, Clock, Flame, Leaf, Star, Info, Heart, Share2, Eye, ShoppingCart, Sparkles, Zap } from 'lucide-react';
import { MenuItem } from '../types';
import { useApp } from '../context/AppContext';

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const { state, dispatch } = useApp();
  const [showDetails, setShowDetails] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const cartItem = state.cart.find(cartItem => cartItem.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Add visual feedback
    await new Promise(resolve => setTimeout(resolve, 300));
    
    dispatch({ type: 'ADD_TO_CART', payload: item });
    setIsAdding(false);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: item.id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: newQuantity } });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, this would save to user preferences
  };

  const handleShare = async () => {
    const shareData = {
      title: item.name,
      text: item.description,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        const shareText = `Check out ${item.name} - ${item.description}`;
        await navigator.clipboard.writeText(shareText);
      }
    } catch (error) {
      // Handle any sharing errors silently
      console.warn('Sharing failed:', error);
    }
  };

  const getSpicyIcon = (level?: string) => {
    if (!level) return null;
    const flames = {
      'mild': 1,
      'medium': 2,
      'hot': 3,
      'very-hot': 4,
    };
    return Array.from({ length: flames[level as keyof typeof flames] }, (_, i) => (
      <Flame key={i} className="w-2 h-2 sm:w-3 sm:h-3 text-orange-400" />
    ));
  };

  const getDietaryBadges = () => {
    if (!item.dietary) return null;
    return item.dietary.map(diet => (
      <span
        key={diet}
        className="badge-modern text-xs"
      >
        {diet === 'vegetarian' && <Leaf className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />}
        {diet === 'vegan' && <Leaf className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />}
        <span className="hidden sm:inline">{diet}</span>
        <span className="sm:hidden">{diet.slice(0, 3)}</span>
      </span>
    ));
  };

  return (
    <div className="glass-card hover-lift group overflow-hidden bg-white/5 border border-white/10">
      {/* Image Section */}
      <div className="relative h-32 sm:h-40 overflow-hidden rounded-t-2xl">
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 animate-shimmer"></div>
        )}
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
            <div className="flex space-x-1">
              {item.popularity && item.popularity >= 4 && (
                <div className="badge-primary flex items-center space-x-1">
                  <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-current" />
                  <span className="hidden sm:inline">Popular</span>
                </div>
              )}
              {item.spicyLevel && (
                <div className="badge-warning flex items-center space-x-1">
                  <Flame className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline capitalize">{item.spicyLevel}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top action buttons */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleLike}
            className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
              isLiked ? 'bg-white text-black' : 'glass text-white hover:bg-white/20'
            }`}
          >
            <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleShare}
            className="p-1.5 glass text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
          >
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1.5 glass text-white hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
          >
            <Info className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Quick view button */}
        <button
          onClick={() => setShowNutrition(!showNutrition)}
          className="absolute top-2 left-2 p-1.5 glass text-white hover:bg-white/20 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4">
        <div className="mb-2 sm:mb-3">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-1 group-hover:text-gradient transition-colors">
              {item.name}
            </h3>
            {item.popularity && (
              <div className="flex items-center space-x-1 ml-2">
                <Star className="w-3 h-3 text-white fill-current" />
                <span className="text-xs font-medium text-gray-300">{item.popularity}</span>
              </div>
            )}
          </div>
          
          {/* Indicators */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {item.spicyLevel && (
                <div className="flex items-center space-x-1">
                  {getSpicyIcon(item.spicyLevel)}
                </div>
              )}
              <div className="badge-modern flex items-center space-x-1">
                <Clock className="w-2 h-2 sm:w-3 sm:h-3" />
                <span>{item.preparationTime} min</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-2">
            {getDietaryBadges()}
          </div>
        </div>
        
        <p className="text-gray-300 text-xs sm:text-sm mb-3 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {/* Nutrition info toggle */}
        {showNutrition && item.nutritionalInfo && (
          <div className="mb-3 glass-dark p-2 sm:p-3 rounded-lg">
            <h5 className="font-medium text-white mb-2 text-xs sm:text-sm flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-white" />
              <span>Nutrition (per serving):</span>
            </h5>
            <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Calories:</span>
                <span className="font-medium text-white">{item.nutritionalInfo.calories}</span>
              </div>
              <div className="flex justify-between">
                <span>Protein:</span>
                <span className="font-medium text-white">{item.nutritionalInfo.protein}g</span>
              </div>
              <div className="flex justify-between">
                <span>Carbs:</span>
                <span className="font-medium text-white">{item.nutritionalInfo.carbs}g</span>
              </div>
              <div className="flex justify-between">
                <span>Fat:</span>
                <span className="font-medium text-white">{item.nutritionalInfo.fat}g</span>
              </div>
            </div>
          </div>
        )}

        {/* Expanded details */}
        {showDetails && (
          <div className="mb-3 glass-dark p-3 rounded-lg space-y-2 text-xs animate-slide-up">
            {item.ingredients && (
              <div>
                <p className="font-semibold text-white mb-1">Ingredients:</p>
                <p className="text-gray-300">{item.ingredients.join(', ')}</p>
              </div>
            )}
            
            {item.allergens && (
              <div>
                <p className="font-semibold text-white mb-1">Allergens:</p>
                <p className="text-orange-300 font-medium">{item.allergens.join(', ')}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold text-white text-glow">K{item.price.toFixed(2)}</span>
            {item.nutritionalInfo && (
              <span className="text-xs text-gray-400">{item.nutritionalInfo.calories} cal</span>
            )}
          </div>
          
          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="btn-primary flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm hover-scale disabled:opacity-50"
            >
              {isAdding ? (
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Add</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center space-x-2 glass rounded-lg p-1">
              <button
                onClick={() => handleUpdateQuantity(quantity - 1)}
                className="btn-secondary w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center hover-scale"
              >
                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <span className="font-bold text-sm sm:text-base w-6 sm:w-8 text-center text-white">{quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(quantity + 1)}
                className="btn-primary w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center hover-scale"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Quick add to favorites */}
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Prep time: {item.preparationTime} min</span>
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 transition-colors hover-scale ${
                isLiked ? 'text-white' : 'hover:text-white'
              }`}
            >
              <Heart className={`w-2 h-2 sm:w-3 sm:h-3 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isLiked ? 'Liked' : 'Like'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}