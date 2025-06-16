import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Utensils, ArrowRight, MapPin, Phone, Clock, Wifi, WifiOff, Star, Sparkles, Award, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { restaurant } from '../data/menuData';

export default function QRCodeLanding() {
  const [tableNumber, setTableNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const handleEnterMenu = async () => {
    if (tableNumber && parseInt(tableNumber) > 0) {
      setIsLoading(true);
      
      // Simulate loading for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: 'SET_TABLE_NUMBER', payload: parseInt(tableNumber) });
      navigate('/menu');
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentHour = now.getHours();
    const todayHours = restaurant.hours[day as keyof typeof restaurant.hours];
    
    if (todayHours?.closed) return 'Closed Today';
    
    const openHour = parseInt(todayHours?.open.split(':')[0] || '0');
    const closeHour = parseInt(todayHours?.close.split(':')[0] || '24');
    
    if (currentHour >= openHour && currentHour < closeHour) {
      return `Open until ${todayHours?.close}`;
    }
    return `Opens at ${todayHours?.open}`;
  };

  // Floating animation elements
  const FloatingElement = ({ children, delay = 0, className = "" }: any) => (
    <div 
      className={`animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20"></div>
      </div>

      {/* Floating Decorative Elements */}
      <FloatingElement delay={0} className="absolute top-20 left-10 text-white opacity-10">
        <Sparkles className="w-8 h-8" />
      </FloatingElement>
      <FloatingElement delay={2} className="absolute top-40 right-20 text-white opacity-10">
        <Award className="w-6 h-6" />
      </FloatingElement>
      <FloatingElement delay={4} className="absolute bottom-40 left-20 text-white opacity-10">
        <Users className="w-7 h-7" />
      </FloatingElement>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass-card animate-scale-in">
            {/* Header with restaurant info */}
            <div className="text-center mb-8">
              <div className="relative mb-6">
                <div className="mx-auto w-24 h-24 glass rounded-full flex items-center justify-center animate-pulse-glow">
                  <Utensils className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-3 text-glow">
                {restaurant.name}
              </h1>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                {restaurant.description}
              </p>
              
              {/* Status indicator */}
              <div className="inline-flex items-center space-x-3 glass px-4 py-2 rounded-full">
                {state.isOnline ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <Wifi className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-white">Online Ordering</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-medium text-red-400">Offline Mode</span>
                  </>
                )}
              </div>
            </div>

            {/* Restaurant details */}
            <div className="space-y-4 mb-8">
              {[
                { icon: MapPin, text: restaurant.address, color: "text-white" },
                { icon: Phone, text: restaurant.phone, color: "text-white" },
                { icon: Clock, text: getCurrentTime(), color: "text-white" },
                { icon: Star, text: "4.8 ★ (1,234 reviews)", color: "text-white" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-4 glass p-4 rounded-xl hover-lift animate-slide-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
                  <span className="text-white font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            {/* QR Code section */}
            <div className="mb-8">
              <div className="glass p-8 rounded-2xl text-center mb-6 hover-glow">
                <div className="glass-dark rounded-2xl p-6 mb-4 inline-block">
                  <QrCode className="w-20 h-20 mx-auto text-white animate-pulse" />
                </div>
                <p className="text-white font-medium">Scan QR code at your table</p>
                <p className="text-gray-300 text-sm mt-1">Quick & contactless ordering</p>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 glass rounded-full text-white font-medium text-sm">
                    or enter manually
                  </span>
                </div>
              </div>
            </div>

            {/* Table number input */}
            <div className="space-y-6">
              <div>
                <label htmlFor="tableNumber" className="block text-white font-semibold mb-3 text-center">
                  Enter Table Number
                </label>
                <input
                  type="number"
                  id="tableNumber"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Table number"
                  className="input-modern w-full text-center text-xl font-bold"
                  min="1"
                  max="100"
                  disabled={isLoading}
                />
              </div>
              
              <button
                onClick={handleEnterMenu}
                disabled={!tableNumber || parseInt(tableNumber) <= 0 || isLoading}
                className="btn-primary w-full py-4 text-lg font-bold hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="loading-spinner w-5 h-5"></div>
                    <span>Loading Menu...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <span>Browse Menu</span>
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </button>
            </div>

            {/* Cuisine highlights */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="text-center mb-6">
                <h3 className="text-white font-bold mb-4 text-lg flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span>Featured Cuisines</span>
                  <Sparkles className="w-5 h-5 text-white" />
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { emoji: "🍲", name: "Traditional Zambian" },
                    { emoji: "🌍", name: "African Fusion" },
                    { emoji: "🍽️", name: "Continental" },
                    { emoji: "🍛", name: "Indian Cuisine" }
                  ].map((cuisine, index) => (
                    <div
                      key={index}
                      className="glass p-4 rounded-xl hover-scale cursor-pointer"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="text-2xl mb-2">{cuisine.emoji}</div>
                      <div className="text-white font-medium text-sm">{cuisine.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => navigate('/admin')}
                className="btn-secondary w-full text-sm"
              >
                Restaurant Staff? Access Dashboard →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}