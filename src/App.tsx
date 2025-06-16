import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import QRCodeLanding from './components/QRCodeLanding';
import Menu from './components/Menu';
import OrderConfirmed from './components/OrderConfirmed';
import AdminDashboard from './components/AdminDashboard';
import MultiLanguageSelector from './components/MultiLanguageSelector';
import CurrencySelector from './components/CurrencySelector';
import RestaurantSelector from './components/RestaurantSelector';
import PaymentGateway from './components/PaymentGateway';
import LiveChat from './components/LiveChat';
import RatingReviewModal from './components/RatingReviewModal';
import PushNotificationManager from './components/PushNotificationManager';
import ZoneSelector from './components/ZoneSelector';
import { Globe, DollarSign, Store, MessageCircle, Settings } from 'lucide-react';

function App() {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [showRestaurantSelector, setShowRestaurantSelector] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showZoneSelector, setShowZoneSelector] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <AppProvider>
      <Router>
        <div className="relative bg-black min-h-screen">
          <Routes>
            <Route path="/" element={<QRCodeLanding />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/order-confirmed" element={<OrderConfirmed />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>

          {/* Global Action Buttons */}
          <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
            <button
              onClick={() => setShowLanguageSelector(true)}
              className="p-3 glass text-white rounded-full shadow-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
              title="Change Language"
            >
              <Globe className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowCurrencySelector(true)}
              className="p-3 glass text-white rounded-full shadow-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
              title="Change Currency"
            >
              <DollarSign className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowRestaurantSelector(true)}
              className="p-3 glass text-white rounded-full shadow-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
              title="Select Restaurant"
            >
              <Store className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowZoneSelector(true)}
              className="p-3 glass text-white rounded-full shadow-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
              title="Delivery Zone"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Live Chat Button */}
          <button
            onClick={() => setShowLiveChat(true)}
            className="fixed bottom-4 right-4 z-40 p-4 bg-white text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            title="Live Chat Support"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {/* Modals */}
          <MultiLanguageSelector 
            isOpen={showLanguageSelector} 
            onClose={() => setShowLanguageSelector(false)} 
          />
          
          <CurrencySelector 
            isOpen={showCurrencySelector} 
            onClose={() => setShowCurrencySelector(false)} 
          />
          
          <RestaurantSelector 
            isOpen={showRestaurantSelector} 
            onClose={() => setShowRestaurantSelector(false)} 
          />
          
          <ZoneSelector 
            isOpen={showZoneSelector} 
            onClose={() => setShowZoneSelector(false)} 
          />
          
          {selectedOrder && (
            <PaymentGateway 
              isOpen={showPaymentGateway} 
              onClose={() => setShowPaymentGateway(false)}
              order={selectedOrder}
            />
          )}
          
          <LiveChat 
            isOpen={showLiveChat} 
            onClose={() => setShowLiveChat(false)} 
          />
          
          {selectedOrder && (
            <RatingReviewModal 
              isOpen={showRatingModal} 
              onClose={() => setShowRatingModal(false)}
              order={selectedOrder}
            />
          )}

          {/* Push Notification Manager */}
          <PushNotificationManager />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;