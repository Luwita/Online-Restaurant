import React, { useState } from 'react';
import { X, Save, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

interface OrderEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export default function OrderEditModal({ isOpen, onClose, order }: OrderEditModalProps) {
  const { dispatch } = useApp();
  const [editedOrder, setEditedOrder] = useState<Order>({ ...order });

  const handleSave = () => {
    // In a real app, this would update the order in the backend
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { id: editedOrder.id, status: editedOrder.status }
    });
    
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        type: 'order',
        title: 'Order Updated',
        message: `Order #${order.id.slice(-4)} has been updated successfully.`,
      }
    });
    
    onClose();
  };

  const updateItemQuantity = (itemIndex: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    const updatedItems = [...editedOrder.items];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], quantity: newQuantity };
    
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setEditedOrder(prev => ({
      ...prev,
      items: updatedItems,
      total: newTotal
    }));
  };

  const updateItemInstructions = (itemIndex: number, instructions: string) => {
    const updatedItems = [...editedOrder.items];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], specialInstructions: instructions };
    
    setEditedOrder(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-orange-600 text-white p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Edit Order</h2>
              <p className="text-orange-100">#{order.id.slice(-4)}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-orange-700 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={editedOrder.customerName}
                    onChange={(e) => setEditedOrder(prev => ({ ...prev, customerName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editedOrder.customerPhone}
                    onChange={(e) => setEditedOrder(prev => ({ ...prev, customerPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Table Number
                  </label>
                  <input
                    type="number"
                    value={editedOrder.tableNumber}
                    onChange={(e) => setEditedOrder(prev => ({ ...prev, tableNumber: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Type
                  </label>
                  <select
                    value={editedOrder.deliveryType}
                    onChange={(e) => setEditedOrder(prev => ({ ...prev, deliveryType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="dine-in">Dine In</option>
                    <option value="takeaway">Takeaway</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editedOrder.status}
                    onChange={(e) => setEditedOrder(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={editedOrder.priority || 'normal'}
                    onChange={(e) => setEditedOrder(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              
              <div className="space-y-4">
                {editedOrder.items.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-sm font-medium text-gray-700">K{item.price.toFixed(2)} each</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateItemQuantity(index, item.quantity - 1)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateItemQuantity(index, item.quantity + 1)}
                          className="bg-orange-600 hover:bg-orange-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Instructions
                      </label>
                      <textarea
                        value={item.specialInstructions || ''}
                        onChange={(e) => updateItemInstructions(index, e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                        placeholder="Any special instructions..."
                      />
                    </div>
                    
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">
                        Subtotal: K{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-orange-600">K{editedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h3>
              <textarea
                value={editedOrder.notes || ''}
                onChange={(e) => setEditedOrder(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                placeholder="Add any notes about this order..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-white p-6">
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}