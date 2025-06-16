import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, CreditCard, Smartphone, Banknote, Clock, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { state, dispatch } = useApp();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mobile-money' | 'card'>('cash');
  const [deliveryType, setDeliveryType] = useState<'dine-in' | 'takeaway'>('dine-in');
  const navigate = useNavigate();

  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedTime = state.cart.length > 0 
    ? Math.max(...state.cart.map(item => item.preparationTime)) + 5 
    : 0;

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const handleUpdateInstructions = (id: string, instructions: string) => {
    dispatch({ type: 'UPDATE_CART_ITEM_INSTRUCTIONS', payload: { id, instructions } });
  };

  const handlePlaceOrder = () => {
    if (!customerName.trim() || !customerPhone.trim() || state.cart.length === 0 || !state.currentTableNumber) {
      return;
    }

    dispatch({
      type: 'PLACE_ORDER',
      payload: {
        tableNumber: state.currentTableNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        items: state.cart,
        total,
        status: 'pending',
        notes: notes.trim() || undefined,
        paymentMethod,
        paymentStatus: 'pending',
        deliveryType,
        priority: 'normal',
      },
    });

    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setNotes('');
    onClose();
    navigate('/order-confirmed');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-80" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md glass shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-black text-white p-4 flex items-center justify-between border-b border-white/20">
            <div>
              <h2 className="text-lg font-semibold">Your Order</h2>
              {state.cart.length > 0 && (
                <div className="flex items-center space-x-2 text-gray-300 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Est. {estimatedTime} min</span>
                </div>
              )}
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {state.cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                <ShoppingBag className="w-16 h-16 mb-4" />
                <h3 className="text-lg font-medium mb-2 text-white">Your cart is empty</h3>
                <p className="text-center text-sm">Add some delicious items from our menu to get started!</p>
              </div>
            ) : (
              <div className="p-4 space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {state.cart.map((item) => (
                    <div key={item.id} className="glass rounded-lg p-4 border border-white/20">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-white">{item.name}</h3>
                          <p className="text-sm text-gray-300 mt-1">K{item.price.toFixed(2)} each</p>
                        </div>
                        <span className="font-bold text-white">
                          K{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="glass border border-white/20 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4 text-white" />
                          </button>
                          <span className="font-medium w-8 text-center text-white">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="bg-white hover:bg-gray-200 text-black w-8 h-8 rounded-full flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Special instructions */}
                      <textarea
                        placeholder="Special instructions (optional)"
                        value={item.specialInstructions || ''}
                        onChange={(e) => handleUpdateInstructions(item.id, e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-sm glass border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 resize-none text-white placeholder-gray-400"
                      />
                    </div>
                  ))}
                </div>

                {/* Delivery Type */}
                <div>
                  <h3 className="font-medium text-white mb-3">Order Type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDeliveryType('dine-in')}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        deliveryType === 'dine-in'
                          ? 'border-white bg-white/20 text-white'
                          : 'border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      Dine In
                    </button>
                    <button
                      onClick={() => setDeliveryType('takeaway')}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        deliveryType === 'takeaway'
                          ? 'border-white bg-white/20 text-white'
                          : 'border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      Takeaway
                    </button>
                  </div>
                </div>

                {/* Customer Details */}
                <div>
                  <h3 className="font-medium text-white mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 glass border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-gray-400"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone number * (e.g., +260 97 123 4567)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 glass border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-gray-400"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 glass border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="font-medium text-white mb-3">Payment Method</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'cash', label: 'Cash', icon: Banknote },
                      { id: 'mobile-money', label: 'Mobile Money', icon: Smartphone },
                      { id: 'card', label: 'Card', icon: CreditCard },
                    ].map(({ id, label, icon: Icon }) => (
                      <label key={id} className="flex items-center p-3 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10">
                        <input
                          type="radio"
                          name="payment"
                          value={id}
                          checked={paymentMethod === id}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="text-white focus:ring-white/50"
                        />
                        <Icon className="w-5 h-5 ml-3 mr-2 text-gray-300" />
                        <span className="text-sm font-medium text-white">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Order Notes */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Order Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Any special requests or dietary requirements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 resize-none text-white placeholder-gray-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {state.cart.length > 0 && (
            <div className="border-t border-white/20 glass p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-white">Total:</span>
                <span className="text-xl font-bold text-white">K{total.toFixed(2)}</span>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={!customerName.trim() || !customerPhone.trim()}
                className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Place Order
              </button>
              
              <p className="text-xs text-gray-400 text-center mt-2">
                * Required fields
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}