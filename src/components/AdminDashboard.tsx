import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Clock, CheckCircle, Package, Users, TrendingUp, Bell, Settings, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import OrderCard from './OrderCard';
import NotificationPanel from './NotificationPanel';
import EnhancedAnalyticsDashboard from './EnhancedAnalyticsDashboard';
import MenuManagement from './MenuManagement';
import SettingsPanel from './SettingsPanel';
import OrderManagement from './OrderManagement';

export default function AdminDashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'analytics' | 'settings'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'completed'>('all');
  const [showNotifications, setShowNotifications] = useState(false);

  const filteredOrders = useMemo(() => {
    if (orderFilter === 'all') return state.orders;
    return state.orders.filter(order => order.status === orderFilter);
  }, [state.orders, orderFilter]);

  const orderStats = useMemo(() => {
    const pending = state.orders.filter(order => order.status === 'pending').length;
    const preparing = state.orders.filter(order => order.status === 'preparing').length;
    const ready = state.orders.filter(order => order.status === 'ready').length;
    const completed = state.orders.filter(order => order.status === 'completed').length;
    const totalRevenue = state.orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.total, 0);

    return { pending, preparing, ready, completed, totalRevenue };
  }, [state.orders]);

  const unreadNotifications = state.notifications.filter(n => !n.read).length;

  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'menu', label: 'Menu', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-105 bg-gray-100 rounded-lg px-4 py-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </button>
              
              <div className="h-8 w-px bg-gray-300" />
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Restaurant Dashboard
                </h1>
                <p className="text-gray-600 text-sm mt-1">Manage your restaurant operations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-3 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-110 bg-gray-100 rounded-lg border border-gray-200"
              >
                <Bell className="w-6 h-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              <div className="text-right bg-gray-100 rounded-lg px-4 py-2 border border-gray-200">
                <p className="text-sm text-gray-600">{format(new Date(), 'PPP')}</p>
                <p className="text-xs text-gray-500">{format(new Date(), 'p')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900">{orderStats.pending}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <span className="text-xs text-gray-500">Needs attention</span>
                </div>
              </div>
              <Clock className="w-10 h-10 text-gray-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Preparing</p>
                <p className="text-3xl font-bold text-gray-900">{orderStats.preparing}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <span className="text-xs text-gray-500">In kitchen</span>
                </div>
              </div>
              <Package className="w-10 h-10 text-gray-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready</p>
                <p className="text-3xl font-bold text-gray-900">{orderStats.ready}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <span className="text-xs text-gray-500">For pickup</span>
                </div>
              </div>
              <CheckCircle className="w-10 h-10 text-gray-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{orderStats.completed}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <span className="text-xs text-gray-500">Happy customers</span>
                </div>
              </div>
              <Users className="w-10 h-10 text-gray-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                <p className="text-3xl font-bold text-gray-900">K{orderStats.totalRevenue.toFixed(0)}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <span className="text-xs text-gray-500">Daily earnings</span>
                </div>
              </div>
              <TrendingUp className="w-10 h-10 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`py-6 px-8 border-b-2 font-semibold text-sm flex items-center space-x-3 transition-all duration-300 ${
                    activeTab === id
                      ? 'border-black text-gray-900 bg-gray-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-lg">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'orders' && <OrderManagement />}
            {activeTab === 'menu' && <MenuManagement />}
            {activeTab === 'analytics' && <EnhancedAnalyticsDashboard />}
            {activeTab === 'settings' && <SettingsPanel />}
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
}