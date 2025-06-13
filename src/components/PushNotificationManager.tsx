import React, { useEffect, useState } from 'react';
import { Bell, BellOff, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PushNotificationManager() {
  const { state, dispatch } = useApp();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return;

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        // Register service worker for push notifications
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/sw.js');
          
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              type: 'system',
              title: 'Notifications Enabled',
              message: 'You will now receive order updates and promotions',
              priority: 'low',
            }
          });
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from your restaurant app!',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: 'test',
        requireInteraction: false,
      });
    }
  };

  const sendOrderNotification = (order: any) => {
    if (permission === 'granted') {
      new Notification(`Order Update - #${order.id.slice(-4)}`, {
        body: `Your order status has been updated to: ${order.status}`,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: `order-${order.id}`,
        data: { orderId: order.id, type: 'order-update' },
        actions: [
          { action: 'view', title: 'View Order' },
          { action: 'close', title: 'Close' },
        ],
      });
    }
  };

  // Listen for order updates to send notifications
  useEffect(() => {
    const lastOrder = state.orders[state.orders.length - 1];
    if (lastOrder && permission === 'granted') {
      sendOrderNotification(lastOrder);
    }
  }, [state.orders, permission]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {permission === 'default' && (
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 max-w-sm">
          <div className="flex items-start space-x-3">
            <Bell className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-white mb-1">Enable Notifications</h4>
              <p className="text-sm text-gray-300 mb-3">
                Get real-time updates about your orders and special offers
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={requestPermission}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Enable
                </button>
                <button
                  onClick={() => setPermission('denied')}
                  className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  Not Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {permission === 'granted' && (
        <button
          onClick={sendTestNotification}
          className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"
          title="Test Notification"
        >
          <Bell className="w-5 h-5" />
        </button>
      )}

      {permission === 'denied' && (
        <div className="p-3 bg-red-600/20 text-red-300 rounded-full border border-red-600/30">
          <BellOff className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}