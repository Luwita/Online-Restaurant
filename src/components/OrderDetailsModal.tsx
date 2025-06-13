import React from 'react';
import { X, User, Phone, MapPin, Clock, CreditCard, Smartphone, Banknote, MessageSquare, Star, Calendar } from 'lucide-react';
import { Order } from '../types';
import { format } from 'date-fns';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export default function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  if (!isOpen) return null;

  const getPaymentIcon = (method?: string) => {
    switch (method) {
      case 'cash': return <Banknote className="w-4 h-4" />;
      case 'mobile-money': return <Smartphone className="w-4 h-4" />;
      case 'card': return <CreditCard className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-orange-600 text-white p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Order Details</h2>
              <p className="text-orange-100">#{order.id.slice(-4)}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-orange-700 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Order Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Placed:</span>
                  <span className="font-medium">{format(order.timestamp, 'PPp')}</span>
                </div>
                
                {order.estimatedTime && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Est. Time:</span>
                    <span className="font-medium">{order.estimatedTime} min</span>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{order.customerName}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{order.customerPhone}</span>
                </div>
                
                {order.customerEmail && (
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{order.customerEmail}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Table:</span>
                  <span className="font-medium">{order.tableNumber}</span>
                  <span className="text-sm text-gray-500">({order.deliveryType})</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start bg-white rounded-lg p-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{item.quantity}x</span>
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      {item.specialInstructions && (
                        <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                          <div className="flex items-start space-x-2">
                            <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-blue-800">Special Instructions:</p>
                              <p className="text-sm text-blue-700">{item.specialInstructions}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">K{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">K{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-orange-600">K{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  {getPaymentIcon(order.paymentMethod)}
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium capitalize">{order.paymentMethod?.replace('-', ' ')}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus || 'pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h3>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-gray-700">{order.notes}</p>
                </div>
              </div>
            )}

            {/* Priority */}
            {order.priority && order.priority !== 'normal' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  order.priority === 'urgent' ? 'bg-red-600 text-white' :
                  order.priority === 'high' ? 'bg-orange-600 text-white' :
                  'bg-gray-300 text-gray-700'
                }`}>
                  {order.priority.toUpperCase()} PRIORITY
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-white p-6">
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}