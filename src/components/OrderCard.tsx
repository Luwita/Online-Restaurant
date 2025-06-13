import React from 'react';
import { Clock, User, Phone, MessageSquare, MapPin, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { Order } from '../types';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const { dispatch } = useApp();

  const handleStatusUpdate = (newStatus: Order['status']) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { id: order.id, status: newStatus },
    });
  };

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      dispatch({ type: 'CANCEL_ORDER', payload: order.id });
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

  const getPaymentIcon = (method?: string) => {
    switch (method) {
      case 'cash': return <Banknote className="w-4 h-4" />;
      case 'mobile-money': return <Smartphone className="w-4 h-4" />;
      case 'card': return <CreditCard className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getNextActions = () => {
    switch (order.status) {
      case 'pending': 
        return [
          { action: 'Confirm Order', nextStatus: 'confirmed' as const, color: 'bg-blue-600 hover:bg-blue-700' },
          { action: 'Cancel', nextStatus: 'cancelled' as const, color: 'bg-red-600 hover:bg-red-700' }
        ];
      case 'confirmed': 
        return [{ action: 'Start Preparing', nextStatus: 'preparing' as const, color: 'bg-orange-600 hover:bg-orange-700' }];
      case 'preparing': 
        return [{ action: 'Mark Ready', nextStatus: 'ready' as const, color: 'bg-green-600 hover:bg-green-700' }];
      case 'ready': 
        return [{ action: 'Mark Delivered', nextStatus: 'delivered' as const, color: 'bg-purple-600 hover:bg-purple-700' }];
      case 'delivered': 
        return [{ action: 'Complete Order', nextStatus: 'completed' as const, color: 'bg-gray-600 hover:bg-gray-700' }];
      default: 
        return [];
    }
  };

  const nextActions = getNextActions();

  return (
    <div className={`bg-white border rounded-lg p-6 hover:shadow-md transition-all duration-200 ${
      order.priority === 'urgent' ? 'border-red-300 bg-red-50' : 
      order.priority === 'high' ? 'border-orange-300 bg-orange-50' : 
      'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.id.slice(-4)}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            {order.priority !== 'normal' && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                order.priority === 'urgent' ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'
              }`}>
                {order.priority.toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Table {order.tableNumber} • {order.deliveryType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{order.customerPhone}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(order.timestamp, { addSuffix: true })}</span>
              </div>
              {order.estimatedTime && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Est. {order.estimatedTime} min</span>
                </div>
              )}
              {order.paymentMethod && (
                <div className="flex items-center space-x-2">
                  {getPaymentIcon(order.paymentMethod)}
                  <span className="capitalize">{order.paymentMethod.replace('-', ' ')}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">K{order.total.toFixed(2)}</p>
          <p className="text-sm text-gray-600">{order.items.length} items</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-3">Items:</h4>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">
                    {item.quantity}x {item.name}
                  </span>
                  {item.specialInstructions && (
                    <p className="text-xs text-gray-600 mt-1 italic">
                      Note: {item.specialInstructions}
                    </p>
                  )}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  K{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Special Notes */}
      {order.notes && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-blue-800 mb-1">Order Notes:</p>
              <p className="text-sm text-blue-700">{order.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {nextActions.length > 0 && order.status !== 'cancelled' && order.status !== 'completed' && (
        <div className="flex flex-wrap gap-2">
          {nextActions.map((actionItem, index) => (
            <button
              key={index}
              onClick={() => {
                if (actionItem.nextStatus === 'cancelled') {
                  handleCancelOrder();
                } else {
                  handleStatusUpdate(actionItem.nextStatus);
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${actionItem.color}`}
            >
              {actionItem.action}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}