export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  preparationTime: number; // in minutes
  spicyLevel?: 'mild' | 'medium' | 'hot' | 'very-hot';
  dietary?: ('vegetarian' | 'vegan' | 'gluten-free' | 'halal')[];
  allergens?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients?: string[];
  popularity?: number; // 1-5 rating
  restaurantId?: string; // Multi-restaurant support
}

export interface CartItem extends MenuItem {
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';
  timestamp: Date;
  estimatedTime?: number;
  notes?: string;
  paymentMethod?: 'cash' | 'mobile-money' | 'card' | 'crypto' | 'paypal';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  deliveryType: 'dine-in' | 'takeaway' | 'delivery';
  priority?: 'normal' | 'high' | 'urgent';
  restaurantId?: string;
  zoneId?: string;
  currency?: string;
  rating?: number;
  review?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  available: boolean;
  restaurantId?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  coverImage?: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  hours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  settings: {
    acceptsOnlineOrders: boolean;
    deliveryEnabled: boolean;
    takeawayEnabled: boolean;
    dineInEnabled: boolean;
    currency: string;
    language: string;
    timezone: string;
    taxRate: number;
    serviceCharge: number;
  };
  location: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  zones: Zone[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Zone {
  id: string;
  name: string;
  description?: string;
  restaurantId: string;
  deliveryFee: number;
  minimumOrder: number;
  estimatedDeliveryTime: number;
  isActive: boolean;
  boundaries: {
    latitude: number;
    longitude: number;
  }[];
}

export interface Notification {
  id: string;
  type: 'order' | 'payment' | 'system' | 'promotion' | 'review';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  orderId?: string;
  restaurantId?: string;
  userId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
}

export interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  popularItems: { item: MenuItem; count: number }[];
  peakHours: { hour: number; orders: number }[];
  customerSatisfaction: number;
  restaurantId?: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  conversionRate: number;
  repeatCustomerRate: number;
  averageDeliveryTime: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  preferences: {
    language: string;
    currency: string;
    dietary: string[];
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  addresses: Address[];
  favoriteRestaurants: string[];
  orderHistory: string[];
  loyaltyPoints: number;
  createdAt: Date;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile-money' | 'crypto' | 'paypal' | 'bank-transfer';
  name: string;
  isEnabled: boolean;
  config: {
    apiKey?: string;
    secretKey?: string;
    webhookUrl?: string;
    supportedCurrencies: string[];
  };
}

export interface Review {
  id: string;
  orderId: string;
  restaurantId: string;
  userId: string;
  rating: number;
  comment?: string;
  images?: string[];
  response?: {
    message: string;
    timestamp: Date;
  };
  timestamp: Date;
  isVerified: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'order';
  isRead: boolean;
  orderId?: string;
  restaurantId?: string;
}

export interface PushNotificationSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId?: string;
  restaurantId?: string;
}

export interface APIIntegration {
  id: string;
  name: string;
  type: 'payment' | 'delivery' | 'pos' | 'inventory' | 'analytics' | 'marketing';
  isEnabled: boolean;
  config: Record<string, any>;
  webhookUrl?: string;
  apiKey?: string;
  lastSync?: Date;
}

export interface MultiLanguageContent {
  [languageCode: string]: {
    name: string;
    description: string;
    [key: string]: string;
  };
}

export interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
}