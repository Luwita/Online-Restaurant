import React from 'react';
import { X, Bell, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { state, dispatch } = useApp();

  const handleMarkAsRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const handleClearAll = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Bell className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-orange-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Notifications</h2>
              {state.notifications.filter(n => !n.read).length > 0 && (
                <span className="bg-orange-800 text-xs px-2 py-1 rounded-full">
                  {state.notifications.filter(n => !n.read).length}
                </span>
              )}
            </div>
            <button onClick={onClose} className="p-1 hover:bg-orange-700 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          {state.notifications.length > 0 && (
            <div className="p-4 border-b">
              <button
                onClick={handleClearAll}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear All Notifications
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {state.notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                <Bell className="w-16 h-16 mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-center text-sm">You're all caught up! New notifications will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {state.notifications
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${
                            !notification.read ? 'text-gray-700' : 'text-gray-500'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatDistanceToNow(notification.timestamp, { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}