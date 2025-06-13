import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem, Order, MenuItem, Notification, Analytics, Restaurant, User } from '../types';
import { menuItems } from '../data/menuData';

interface AppState {
  cart: CartItem[];
  orders: Order[];
  menuItems: MenuItem[];
  currentTableNumber: number | null;
  currentRestaurant: string | null;
  currentLanguage: string;
  currentCurrency: string;
  currentZone: string | null;
  notifications: Notification[];
  analytics: Analytics;
  searchQuery: string;
  selectedFilters: {
    dietary: string[];
    spicyLevel: string[];
    priceRange: [number, number];
  };
  isOnline: boolean;
  darkMode: boolean;
  user: User | null;
  restaurants: Restaurant[];
  reviews: any[];
  chatMessages: any[];
  paymentMethods: any[];
  pushNotificationEnabled: boolean;
}

type AppAction =
  | { type: 'ADD_TO_CART'; payload: MenuItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'UPDATE_CART_ITEM_INSTRUCTIONS'; payload: { id: string; instructions: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'PLACE_ORDER'; payload: Omit<Order, 'id' | 'timestamp'> }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: Order['status'] } }
  | { type: 'CANCEL_ORDER'; payload: string }
  | { type: 'SET_TABLE_NUMBER'; payload: number }
  | { type: 'SET_CURRENT_RESTAURANT'; payload: string }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_CURRENCY'; payload: string }
  | { type: 'SET_DELIVERY_ZONE'; payload: string }
  | { type: 'UPDATE_MENU_ITEM'; payload: MenuItem }
  | { type: 'ADD_MENU_ITEM'; payload: MenuItem }
  | { type: 'TOGGLE_MENU_ITEM_AVAILABILITY'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<AppState['selectedFilters']> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_REVIEW'; payload: any }
  | { type: 'ADD_CHAT_MESSAGE'; payload: any }
  | { type: 'ENABLE_PUSH_NOTIFICATIONS' }
  | { type: 'UPDATE_ANALYTICS' };

const initialState: AppState = {
  cart: [],
  orders: [],
  menuItems,
  currentTableNumber: null,
  currentRestaurant: null,
  currentLanguage: 'en',
  currentCurrency: 'ZMW',
  currentZone: null,
  notifications: [],
  analytics: {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    popularItems: [],
    peakHours: [],
    customerSatisfaction: 4.5,
    period: 'daily',
    conversionRate: 0,
    repeatCustomerRate: 0,
    averageDeliveryTime: 0,
  },
  searchQuery: '',
  selectedFilters: {
    dietary: [],
    spicyLevel: [],
    priceRange: [0, 200],
  },
  isOnline: navigator.onLine,
  darkMode: false,
  user: null,
  restaurants: [],
  reviews: [],
  chatMessages: [],
  paymentMethods: [],
  pushNotificationEnabled: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0),
      };
    case 'UPDATE_CART_ITEM_INSTRUCTIONS':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, specialInstructions: action.payload.instructions }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
    case 'PLACE_ORDER': {
      const newOrder: Order = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
        estimatedTime: Math.max(...action.payload.items.map(item => item.preparationTime)) + 5,
        restaurantId: state.currentRestaurant || undefined,
        zoneId: state.currentZone || undefined,
        currency: state.currentCurrency,
      };
      
      // Add notification
      const notification: Notification = {
        id: Date.now().toString() + '_notif',
        type: 'order',
        title: 'New Order Received',
        message: `Order #${newOrder.id.slice(-4)} from Table ${newOrder.tableNumber}`,
        timestamp: new Date(),
        read: false,
        orderId: newOrder.id,
        restaurantId: newOrder.restaurantId,
        priority: 'medium',
      };

      return {
        ...state,
        orders: [...state.orders, newOrder],
        cart: [],
        notifications: [...state.notifications, notification],
      };
    }
    case 'UPDATE_ORDER_STATUS': {
      const updatedOrders = state.orders.map(order =>
        order.id === action.payload.id
          ? { ...order, status: action.payload.status }
          : order
      );
      
      // Add notification for status updates
      const order = state.orders.find(o => o.id === action.payload.id);
      let notification: Notification | null = null;
      
      if (order) {
        notification = {
          id: Date.now().toString() + '_status',
          type: 'order',
          title: 'Order Status Updated',
          message: `Order #${order.id.slice(-4)} is now ${action.payload.status}`,
          timestamp: new Date(),
          read: false,
          orderId: order.id,
          restaurantId: order.restaurantId,
          priority: 'medium',
        };
      }

      return {
        ...state,
        orders: updatedOrders,
        notifications: notification ? [...state.notifications, notification] : state.notifications,
      };
    }
    case 'CANCEL_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload
            ? { ...order, status: 'cancelled' as const }
            : order
        ),
      };
    case 'SET_TABLE_NUMBER':
      return {
        ...state,
        currentTableNumber: action.payload,
      };
    case 'SET_CURRENT_RESTAURANT':
      return {
        ...state,
        currentRestaurant: action.payload,
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        currentLanguage: action.payload,
      };
    case 'SET_CURRENCY':
      return {
        ...state,
        currentCurrency: action.payload,
      };
    case 'SET_DELIVERY_ZONE':
      return {
        ...state,
        currentZone: action.payload,
      };
    case 'UPDATE_MENU_ITEM':
      return {
        ...state,
        menuItems: state.menuItems.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'ADD_MENU_ITEM':
      return {
        ...state,
        menuItems: [...state.menuItems, action.payload],
      };
    case 'TOGGLE_MENU_ITEM_AVAILABILITY':
      return {
        ...state,
        menuItems: state.menuItems.map(item =>
          item.id === action.payload
            ? { ...item, available: !item.available }
            : item
        ),
      };
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
        restaurantId: state.currentRestaurant || undefined,
      };
      return {
        ...state,
        notifications: [...state.notifications, newNotification],
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
      };
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    case 'SET_FILTERS':
      return {
        ...state,
        selectedFilters: { ...state.selectedFilters, ...action.payload },
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        selectedFilters: {
          dietary: [],
          spicyLevel: [],
          priceRange: [0, 200],
        },
        searchQuery: '',
      };
    case 'SET_ONLINE_STATUS':
      return {
        ...state,
        isOnline: action.payload,
      };
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'ADD_REVIEW':
      return {
        ...state,
        reviews: [...state.reviews, action.payload],
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
      };
    case 'ENABLE_PUSH_NOTIFICATIONS':
      return {
        ...state,
        pushNotificationEnabled: true,
      };
    case 'UPDATE_ANALYTICS': {
      const completedOrders = state.orders.filter(order => order.status === 'completed');
      const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
      const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
      
      // Calculate popular items
      const itemCounts: { [key: string]: { item: MenuItem; count: number } } = {};
      completedOrders.forEach(order => {
        order.items.forEach(item => {
          if (itemCounts[item.id]) {
            itemCounts[item.id].count += item.quantity;
          } else {
            itemCounts[item.id] = { item, count: item.quantity };
          }
        });
      });
      
      const popularItems = Object.values(itemCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        ...state,
        analytics: {
          ...state.analytics,
          totalOrders: completedOrders.length,
          totalRevenue,
          averageOrderValue,
          popularItems,
          conversionRate: state.orders.length > 0 ? (completedOrders.length / state.orders.length) * 100 : 0,
          repeatCustomerRate: 75, // Mock data
          averageDeliveryTime: 25, // Mock data
        },
      };
    }
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update analytics when orders change
  useEffect(() => {
    dispatch({ type: 'UPDATE_ANALYTICS' });
  }, [state.orders]);

  // Apply dark mode
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    const savedCurrency = localStorage.getItem('preferred-currency');
    
    if (savedLanguage) {
      dispatch({ type: 'SET_LANGUAGE', payload: savedLanguage });
    }
    if (savedCurrency) {
      dispatch({ type: 'SET_CURRENCY', payload: savedCurrency });
    }
  }, []);

  // Save user preferences to localStorage
  useEffect(() => {
    localStorage.setItem('preferred-language', state.currentLanguage);
    localStorage.setItem('preferred-currency', state.currentCurrency);
  }, [state.currentLanguage, state.currentCurrency]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}