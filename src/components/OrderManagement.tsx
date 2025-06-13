import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Package, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Download,
  Printer,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Star,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Users,
  Timer
} from 'lucide-react';
import { format, isToday, isYesterday, startOfWeek, endOfWeek } from 'date-fns';
import { Order } from '../types';
import OrderDetailsModal from './OrderDetailsModal';
import OrderEditModal from './OrderEditModal';

export default function OrderManagement() {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday' | 'week' | 'month'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'pending' | 'failed'>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'total' | 'status'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const filteredOrders = useMemo(() => {
    let orders = state.orders;

    // Search filter
    if (searchQuery) {
      orders = orders.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery) ||
        order.tableNumber.toString().includes(searchQuery)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      orders = orders.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      orders = orders.filter(order => {
        switch (dateFilter) {
          case 'today':
            return isToday(order.timestamp);
          case 'yesterday':
            return isYesterday(order.timestamp);
          case 'week':
            return order.timestamp >= startOfWeek(now) && order.timestamp <= endOfWeek(now);
          case 'month':
            return order.timestamp.getMonth() === now.getMonth() && 
                   order.timestamp.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      orders = orders.filter(order => order.paymentStatus === paymentFilter);
    }

    // Sort orders
    orders.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'timestamp':
          aValue = a.timestamp.getTime();
          bValue = b.timestamp.getTime();
          break;
        case 'total':
          aValue = a.total;
          bValue = b.total;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.timestamp.getTime();
          bValue = b.timestamp.getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return orders;
  }, [state.orders, searchQuery, statusFilter, dateFilter, paymentFilter, sortBy, sortOrder]);

  const orderStats = useMemo(() => {
    const today = new Date();
    const todayOrders = state.orders.filter(order => isToday(order.timestamp));
    const pendingOrders = state.orders.filter(order => order.status === 'pending');
    const completedToday = todayOrders.filter(order => order.status === 'completed');
    const totalRevenue = completedToday.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = completedToday.length > 0 ? totalRevenue / completedToday.length : 0;

    return {
      todayOrders: todayOrders.length,
      pendingOrders: pendingOrders.length,
      completedToday: completedToday.length,
      totalRevenue,
      averageOrderValue,
    };
  }, [state.orders]);

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { id: orderId, status: newStatus },
    });
  };

  const handleBulkStatusUpdate = (newStatus: Order['status']) => {
    selectedOrders.forEach(orderId => {
      handleStatusUpdate(orderId, newStatus);
    });
    setSelectedOrders([]);
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      dispatch({ type: 'CANCEL_ORDER', payload: orderId });
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

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Order Management</h3>
          <p className="text-sm text-gray-600 mt-1">
            Track and manage all customer orders
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Orders</p>
              <p className="text-2xl font-bold text-blue-600">{orderStats.todayOrders}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{orderStats.pendingOrders}</p>
            </div>
            <Timer className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-green-600">{orderStats.completedToday}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-purple-600">K{orderStats.totalRevenue.toFixed(0)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-teal-600">K{orderStats.averageOrderValue.toFixed(0)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-teal-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as any);
                setSortOrder(order as any);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="timestamp-desc">Newest First</option>
              <option value="timestamp-asc">Oldest First</option>
              <option value="total-desc">Highest Value</option>
              <option value="total-asc">Lowest Value</option>
              <option value="status-asc">Status A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-orange-800">
              {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkStatusUpdate('confirmed')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('preparing')}
                className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors"
              >
                Start Preparing
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('ready')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                Mark Ready
              </button>
              <button
                onClick={() => setSelectedOrders([])}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className="font-medium text-gray-900">#{order.id.slice(-4)}</div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>Table {order.tableNumber}</span>
                          {order.priority !== 'normal' && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                              {order.priority?.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{order.customerPhone}</span>
                      </div>
                      <div className="text-xs text-gray-500 capitalize">{order.deliveryType}</div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.items.slice(0, 2).map(item => item.name).join(', ')}
                      {order.items.length > 2 && '...'}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="font-semibold text-gray-900">K{order.total.toFixed(2)}</div>
                  </td>

                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus || 'pending'}
                      </span>
                      <div className="text-xs text-gray-500 capitalize">
                        {order.paymentMethod?.replace('-', ' ')}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {format(order.timestamp, 'MMM dd, HH:mm')}
                    </div>
                    {order.estimatedTime && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{order.estimatedTime}m est.</span>
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleEditOrder(order)}
                        className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                        title="Edit order"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">No orders found</p>
            <p className="text-sm">
              {searchQuery || statusFilter !== 'all' || dateFilter !== 'all' || paymentFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No orders have been placed yet'}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedOrder && (
        <>
          <OrderDetailsModal
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
          />
          
          <OrderEditModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
          />
        </>
      )}
    </div>
  );
}