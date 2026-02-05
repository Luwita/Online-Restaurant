import { useApp } from '../context/AppContext';
import { TrendingUp, Users, DollarSign, Clock, Star, Award } from 'lucide-react';

export default function AnalyticsDashboard() {
  const { state } = useApp();

  const analytics = state.analytics;
  const recentOrders = state.orders
    .filter(order => order.status === 'completed')
    .slice(-10);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Orders</p>
              <p className="text-3xl font-bold text-blue-900">{analytics.totalOrders}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Revenue</p>
              <p className="text-3xl font-bold text-green-900">K{analytics.totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg Order Value</p>
              <p className="text-3xl font-bold text-purple-900">K{analytics.averageOrderValue.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Popular Items */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-5 h-5 text-orange-600" />
          <h4 className="text-lg font-semibold text-gray-900">Most Popular Items</h4>
        </div>
        
        {analytics.popularItems.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No data available yet</p>
        ) : (
          <div className="space-y-3">
            {analytics.popularItems.map((item, index) => (
              <div key={item.item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    'bg-gray-300 text-gray-700'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{item.item.name}</p>
                    <p className="text-sm text-gray-600">K{item.item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.count} orders</p>
                  <p className="text-sm text-gray-600">K{(item.count * item.item.price).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Satisfaction */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="w-5 h-5 text-orange-600" />
          <h4 className="text-lg font-semibold text-gray-900">Customer Satisfaction</h4>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.floor(analytics.customerSatisfaction)
                    ? 'text-yellow-500 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-2xl font-bold text-gray-900">
            {analytics.customerSatisfaction.toFixed(1)}
          </span>
          <span className="text-gray-600">out of 5</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="w-5 h-5 text-orange-600" />
          <h4 className="text-lg font-semibold text-gray-900">Recent Completed Orders</h4>
        </div>
        
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No completed orders yet</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Table {order.tableNumber}</p>
                  <p className="text-sm text-gray-600">{order.customerName}</p>
                  <p className="text-xs text-gray-500">
                    {order.timestamp.toLocaleDateString()} at {order.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">K{order.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{order.items.length} items</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}