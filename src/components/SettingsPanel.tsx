import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  Store, 
  Clock, 
  Bell, 
  Palette, 
  Globe, 
  Shield, 
  CreditCard, 
  Printer,
  Wifi,
  Moon,
  Sun,
  Save,
  RefreshCw
} from 'lucide-react';

export default function SettingsPanel() {
  const { state, dispatch } = useApp();
  const [activeSection, setActiveSection] = useState('restaurant');
  const [settings, setSettings] = useState({
    restaurant: {
      name: 'Lusaka Intercontinental',
      address: 'Cairo Road, Lusaka Central Business District',
      phone: '+260 211 123 456',
      email: 'info@lusakaintercontinental.zm',
      description: 'Experience the finest intercontinental cuisine in the heart of Lusaka.',
    },
    hours: {
      monday: { open: '06:00', close: '23:00', closed: false },
      tuesday: { open: '06:00', close: '23:00', closed: false },
      wednesday: { open: '06:00', close: '23:00', closed: false },
      thursday: { open: '06:00', close: '23:00', closed: false },
      friday: { open: '06:00', close: '24:00', closed: false },
      saturday: { open: '07:00', close: '24:00', closed: false },
      sunday: { open: '07:00', close: '22:00', closed: false },
    },
    notifications: {
      newOrders: true,
      orderUpdates: true,
      paymentAlerts: true,
      lowStock: true,
      emailNotifications: true,
      smsNotifications: false,
    },
    appearance: {
      darkMode: state.darkMode,
      primaryColor: '#ea580c',
      language: 'en',
      currency: 'ZMW',
    },
    ordering: {
      allowOnlineOrdering: true,
      requireTableNumber: true,
      allowSpecialInstructions: true,
      autoAcceptOrders: false,
      estimatedPrepTime: 20,
      maxOrdersPerHour: 50,
    },
    payment: {
      acceptCash: true,
      acceptMobileMoney: true,
      acceptCards: true,
      taxRate: 16,
      serviceCharge: 10,
    },
    system: {
      autoBackup: true,
      dataRetention: 90,
      printReceipts: true,
      soundAlerts: true,
    }
  });

  const sections = [
    { id: 'restaurant', label: 'Restaurant Info', icon: Store },
    { id: 'hours', label: 'Operating Hours', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'ordering', label: 'Ordering', icon: Globe },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'system', label: 'System', icon: Settings },
  ];

  const handleSave = () => {
    // In a real app, this would save to backend
    if (settings.appearance.darkMode !== state.darkMode) {
      dispatch({ type: 'TOGGLE_DARK_MODE' });
    }
    
    // Show success message
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        type: 'system',
        title: 'Settings Saved',
        message: 'Your settings have been successfully updated.',
      }
    });
  };

  const renderRestaurantSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Restaurant Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant Name
          </label>
          <input
            type="text"
            value={settings.restaurant.name}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              restaurant: { ...prev.restaurant, name: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={settings.restaurant.phone}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              restaurant: { ...prev.restaurant, phone: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            value={settings.restaurant.address}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              restaurant: { ...prev.restaurant, address: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={settings.restaurant.email}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              restaurant: { ...prev.restaurant, email: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            rows={3}
            value={settings.restaurant.description}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              restaurant: { ...prev.restaurant, description: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderHoursSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Operating Hours</h3>
      
      <div className="space-y-4">
        {Object.entries(settings.hours).map(([day, hours]) => (
          <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-24">
              <span className="font-medium text-gray-900 capitalize">{day}</span>
            </div>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={!hours.closed}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  hours: {
                    ...prev.hours,
                    [day]: { ...hours, closed: !e.target.checked }
                  }
                }))}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">Open</span>
            </label>

            {!hours.closed && (
              <>
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      hours: {
                        ...prev.hours,
                        [day]: { ...hours, open: e.target.value }
                      }
                    }))}
                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      hours: {
                        ...prev.hours,
                        [day]: { ...hours, close: e.target.value }
                      }
                    }))}
                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
      
      <div className="space-y-4">
        {Object.entries(settings.notifications).map(([key, enabled]) => (
          <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium text-gray-900 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <p className="text-sm text-gray-600">
                {key === 'newOrders' && 'Get notified when new orders are placed'}
                {key === 'orderUpdates' && 'Receive updates on order status changes'}
                {key === 'paymentAlerts' && 'Alerts for payment confirmations and failures'}
                {key === 'lowStock' && 'Notifications when items are running low'}
                {key === 'emailNotifications' && 'Send notifications via email'}
                {key === 'smsNotifications' && 'Send notifications via SMS'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notifications: {
                  ...prev.notifications,
                  [key]: e.target.checked
                }
              }))}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
          </label>
        ))}
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Appearance & Localization</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSettings(prev => ({
                ...prev,
                appearance: { ...prev.appearance, darkMode: false }
              }))}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                !settings.appearance.darkMode
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Light</span>
            </button>
            <button
              onClick={() => setSettings(prev => ({
                ...prev,
                appearance: { ...prev.appearance, darkMode: true }
              }))}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                settings.appearance.darkMode
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Dark</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.appearance.language}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              appearance: { ...prev.appearance, language: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="en">English</option>
            <option value="ny">Chichewa</option>
            <option value="bem">Bemba</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={settings.appearance.currency}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              appearance: { ...prev.appearance, currency: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="ZMW">Zambian Kwacha (K)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderOrderingSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Ordering Settings</h3>
      
      <div className="space-y-4">
        {Object.entries(settings.ordering).map(([key, value]) => {
          if (typeof value === 'boolean') {
            return (
              <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    ordering: {
                      ...prev.ordering,
                      [key]: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
              </label>
            );
          } else {
            return (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    ordering: {
                      ...prev.ordering,
                      [key]: parseInt(e.target.value)
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Payment Settings</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Accepted Payment Methods</h4>
          <div className="space-y-2">
            {['acceptCash', 'acceptMobileMoney', 'acceptCards'].map(method => (
              <label key={method} className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.payment[method as keyof typeof settings.payment] as boolean}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    payment: {
                      ...prev.payment,
                      [method]: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {method.replace('accept', '').replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.payment.taxRate}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                payment: { ...prev.payment, taxRate: parseFloat(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Charge (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.payment.serviceCharge}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                payment: { ...prev.payment, serviceCharge: parseFloat(e.target.value) }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
      
      <div className="space-y-4">
        {Object.entries(settings.system).map(([key, value]) => {
          if (typeof value === 'boolean') {
            return (
              <label key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    system: {
                      ...prev.system,
                      [key]: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
              </label>
            );
          } else {
            return (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()} (days)
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    system: {
                      ...prev.system,
                      [key]: parseInt(e.target.value)
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            );
          }
        })}
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">System Actions</h4>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Backup Data</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <Printer className="w-4 h-4" />
            <span>Test Printer</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'restaurant': return renderRestaurantSettings();
      case 'hours': return renderHoursSettings();
      case 'notifications': return renderNotificationSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'ordering': return renderOrderingSettings();
      case 'payment': return renderPaymentSettings();
      case 'system': return renderSystemSettings();
      default: return renderRestaurantSettings();
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
        <nav className="space-y-2">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeSection === id
                  ? 'bg-orange-100 text-orange-700 border border-orange-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl">
          {renderContent()}
          
          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}