import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, Utensils, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function OrderConfirmed() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [estimatedTime, setEstimatedTime] = useState(20);

  // Get the most recent order
  const lastOrder = state.orders[state.orders.length - 1];

  useEffect(() => {
    if (lastOrder?.estimatedTime) {
      setEstimatedTime(lastOrder.estimatedTime);
    }
  }, [lastOrder]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {/* Success Header */}
          <div className="bg-black text-white p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 border border-gray-700">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-3 tracking-wide">Order Confirmed!</h1>
            <p className="text-gray-300 leading-relaxed">
              Thank you for your order. We've received it and will start preparing your food shortly.
            </p>
          </div>

          <div className="p-8">
            {/* Order Details */}
            {lastOrder && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Order Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order #:</span>
                    <span className="font-bold text-gray-900 bg-gray-200 px-3 py-1 rounded-full">#{lastOrder.id.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Table:</span>
                    <span className="font-medium text-gray-900">{lastOrder.tableNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-gray-900 text-lg">K{lastOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-medium text-gray-900 capitalize bg-gray-200 px-3 py-1 rounded-full">{lastOrder.paymentMethod?.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Status Information */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center space-x-4 text-sm bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Estimated preparation time</p>
                  <p className="text-gray-600">{estimatedTime} minutes</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Delivery method</p>
                  <p className="text-gray-600">
                    {lastOrder?.deliveryType === 'dine-in' 
                      ? 'Your food will be delivered to your table' 
                      : 'Ready for pickup at the counter'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">We'll notify you</p>
                  <p className="text-gray-600">When your order is ready</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => navigate('/menu')}
                className="w-full bg-black text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Continue Browsing Menu
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-100 text-gray-700 py-4 px-8 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-3 border border-gray-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
            </div>

            {/* Contact Information */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Need help with your order?</p>
                <p className="text-lg font-bold text-gray-900">Call us: +260 211 123 456</p>
                <div className="flex justify-center space-x-2 mt-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-xs text-gray-600 font-medium">Available 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}