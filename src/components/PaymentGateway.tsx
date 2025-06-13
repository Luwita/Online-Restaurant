import React, { useState } from 'react';
import { CreditCard, Smartphone, Bitcoin, DollarSign, Shield, Lock, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, American Express',
    processingFee: 2.9,
    color: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'mobile-money',
    name: 'Mobile Money',
    icon: Smartphone,
    description: 'MTN Mobile Money, Airtel Money',
    processingFee: 1.5,
    color: 'from-green-600 to-emerald-600',
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: Bitcoin,
    description: 'Bitcoin, Ethereum, USDC',
    processingFee: 1.0,
    color: 'from-orange-600 to-yellow-600',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: DollarSign,
    description: 'Pay with your PayPal account',
    processingFee: 3.4,
    color: 'from-purple-600 to-pink-600',
  },
];

export default function PaymentGateway({ isOpen, onClose, order }: PaymentGatewayProps) {
  const { dispatch } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);
  const processingFee = selectedPaymentMethod ? (order.total * selectedPaymentMethod.processingFee) / 100 : 0;
  const totalWithFees = order.total + processingFee;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setPaymentSuccess(true);
    
    // Update order status
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { id: order.id, status: 'confirmed' }
    });
    
    // Add notification
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        type: 'payment',
        title: 'Payment Successful',
        message: `Payment of K${totalWithFees.toFixed(2)} processed successfully`,
        priority: 'medium',
      }
    });
    
    setTimeout(() => {
      onClose();
      setPaymentSuccess(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-md overflow-hidden">
          {paymentSuccess ? (
            // Success State
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
              <p className="text-gray-300">Your order has been confirmed</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                <div className="flex items-center space-x-3 mb-2">
                  <Shield className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Secure Payment</h2>
                </div>
                <p className="text-purple-100 text-sm">Your payment information is encrypted and secure</p>
              </div>

              {/* Order Summary */}
              <div className="p-6 border-b border-white/20">
                <h3 className="font-semibold text-white mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>K{order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Processing Fee ({selectedPaymentMethod?.processingFee}%)</span>
                    <span>K{processingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white text-lg pt-2 border-t border-white/20">
                    <span>Total</span>
                    <span>K{totalWithFees.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="p-6">
                <h3 className="font-semibold text-white mb-4">Select Payment Method</h3>
                <div className="space-y-3 mb-6">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`w-full p-4 rounded-xl border transition-all duration-200 ${
                          selectedMethod === method.id
                            ? `bg-gradient-to-r ${method.color} bg-opacity-20 border-white/50 text-white`
                            : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-6 h-6" />
                          <div className="text-left flex-1">
                            <div className="font-medium">{method.name}</div>
                            <div className="text-xs opacity-75">{method.description}</div>
                          </div>
                          <div className="text-xs">
                            {method.processingFee}% fee
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Security Notice */}
                <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/20">
                  <div className="flex items-center space-x-2 text-green-400 mb-2">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-medium">Secure Payment</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Your payment is protected by 256-bit SSL encryption and PCI DSS compliance.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                      isProcessing
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : `bg-gradient-to-r ${selectedPaymentMethod?.color} text-white hover:scale-105`
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      `Pay K${totalWithFees.toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}