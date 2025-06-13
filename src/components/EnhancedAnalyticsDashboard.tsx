import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Users, DollarSign, Clock, Star, Award, Calendar, Target, PieChart, BarChart3 } from 'lucide-react';
import { format, subDays, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

export default function EnhancedAnalyticsDashboard() {
  const { state } = useApp();

  const analytics = useMemo(() => {
    const now = new Date();
    const last7Days = subDays(now, 7);
    const last30Days = subDays(now, 30);

    // Filter orders by time periods
    const todayOrders = state.orders.filter(order => 
      isAfter(order.timestamp, startOfDay(now)) && 
      isBefore(order.timestamp, endOfDay(now))
    );
    
    const last7DaysOrders = state.orders.filter(order => 
      isAfter(order.timestamp, last7Days)
    );
    
    const last30DaysOrders = state.orders.filter(order => 
      isAfter(order.timestamp, last30Days)
    );

    const completedOrders = state.orders.filter(order => order.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    // Calculate popular items
    const itemCounts: { [key: string]: { item: any; count: number; revenue: number } } = {};
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        if (itemCounts[item.id]) {
          itemCounts[item.id].count += item.quantity;
          itemCounts[item.id].revenue += item.price * item.quantity;
        } else {
          itemCounts[item.id] = { 
            item, 
            count: item.quantity, 
            revenue: item.price * item.quantity 
          };
        }
      });
    });

    const popularItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate peak hours
    const hourCounts: { [hour: number]: number } = {};
    completedOrders.forEach(order => {
      const hour = order.timestamp.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const peakHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), orders: count }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    // Calculate category performance
    const categoryStats: { [category: string]: { orders: number; revenue: number } } = {};
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        if (!categoryStats[item.category]) {
          categoryStats[item.category] = { orders: 0, revenue: 0 };
        }
        categoryStats[item.category].orders += item.quantity;
        categoryStats[item.category].revenue += item.price * item.quantity;
      });
    });

    // Calculate daily revenue for the last 7 days
    const dailyRevenue = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(now, i);
      const dayOrders = state.orders.filter(order => 
        order.status === 'completed' &&
        isAfter(order.timestamp, startOfDay(date)) && 
        isBefore(order.timestamp, endOfDay(date))
      );
      const revenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      dailyRevenue.push({
        date: format(date, 'MMM dd'),
        revenue,
        orders: dayOrders.length
      });
    }

    return {
      totalOrders: completedOrders.length,
      totalRevenue,
      averageOrderValue,
      popularItems,
      peakHours,
      customerSatisfaction: 4.5,
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.filter(o => o.status === 'completed').reduce((sum, order) => sum + order.total, 0),
      last7DaysOrders: last7DaysOrders.length,
      last30DaysOrders: last30DaysOrders.length,
      categoryStats,
      dailyRevenue,
      averagePreparationTime: completedOrders.length > 0 
        ? completedOrders.reduce((sum, order) => sum + (order.estimatedTime || 20), 0) / completedOrders.length 
        : 0,
    };
  }, [state.orders]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h3>
        <div className="text-sm text-gray-500">
          Last updated: {format(new Date(), 'PPp')}
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Today's Orders</p>
              <p className="text-3xl font-bold">{analytics.todayOrders}</p>
              <p className="text-blue-100 text-xs mt-1">
                {analytics.last7DaysOrders} this week
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Today's Revenue</p>
              <p className="text-3xl font-bold">K{analytics.todayRevenue.toFixed(0)}</p>
              <p className="text-green-100 text-xs mt-1">
                K{analytics.totalRevenue.toFixed(0)} total
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Avg Order Value</p>
              <p className="text-3xl font-bold">K{analytics.averageOrderValue.toFixed(0)}</p>
              <p className="text-purple-100 text-xs mt-1">
                {analytics.totalOrders} total orders
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Avg Prep Time</p>
              <p className="text-3xl font-bold">{analytics.averagePreparationTime.toFixed(0)}m</p>
              <p className="text-orange-100 text-xs mt-1">
                ⭐ {analytics.customerSatisfaction}/5 rating
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Chart */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <h4 className="text-lg font-semibold text-gray-900">Daily Revenue (Last 7 Days)</h4>
          </div>
          
          <div className="space-y-4">
            {analytics.dailyRevenue.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 w-16">{day.date}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(5, (day.revenue / Math.max(...analytics.dailyRevenue.map(d => d.revenue))) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">K{day.revenue.toFixed(0)}</p>
                  <p className="text-xs text-gray-500">{day.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="w-5 h-5 text-orange-600" />
            <h4 className="text-lg font-semibold text-gray-900">Category Performance</h4>
          </div>
          
          <div className="space-y-4">
            {Object.entries(analytics.categoryStats)
              .sort(([,a], [,b]) => b.revenue - a.revenue)
              .slice(0, 6)
              .map(([category, stats], index) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-orange-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-green-500' :
                      index === 3 ? 'bg-purple-500' :
                      index === 4 ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {category.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">K{stats.revenue.toFixed(0)}</p>
                    <p className="text-xs text-gray-500">{stats.orders} items</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Popular Items & Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Award className="w-5 h-5 text-orange-600" />
            <h4 className="text-lg font-semibold text-gray-900">Top Selling Items</h4>
          </div>
          
          {analytics.popularItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sales data available yet</p>
          ) : (
            <div className="space-y-4">
              {analytics.popularItems.slice(0, 8).map((item, index) => (
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
                      <p className="font-medium text-gray-900 text-sm">{item.item.name}</p>
                      <p className="text-xs text-gray-600">K{item.item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">{item.count} sold</p>
                    <p className="text-xs text-gray-600">K{item.revenue.toFixed(0)} revenue</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="w-5 h-5 text-orange-600" />
            <h4 className="text-lg font-semibold text-gray-900">Peak Hours</h4>
          </div>
          
          {analytics.peakHours.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No order data available yet</p>
          ) : (
            <div className="space-y-4">
              {analytics.peakHours.map((hour, index) => (
                <div key={hour.hour} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-orange-500 text-white' :
                      index === 1 ? 'bg-orange-400 text-white' :
                      index === 2 ? 'bg-orange-300 text-white' :
                      'bg-gray-300 text-gray-700'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {hour.hour}:00 - {hour.hour + 1}:00
                      </p>
                      <p className="text-xs text-gray-600">
                        {hour.hour < 12 ? 'AM' : 'PM'} time slot
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{hour.orders} orders</p>
                    <p className="text-xs text-gray-600">Peak activity</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Customer Satisfaction */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Star className="w-5 h-5 text-orange-600" />
          <h4 className="text-lg font-semibold text-gray-900">Customer Satisfaction</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 ${
                    star <= Math.floor(analytics.customerSatisfaction)
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {analytics.customerSatisfaction.toFixed(1)}
            </p>
            <p className="text-sm text-gray-600">Overall Rating</p>
          </div>
          
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 mb-1">
              {Math.round((analytics.customerSatisfaction / 5) * 100)}%
            </p>
            <p className="text-sm text-gray-600">Customer Satisfaction</p>
          </div>
          
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 mb-1">
              {analytics.totalOrders}
            </p>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </div>
        </div>
      </div>
    </div>
  );
}