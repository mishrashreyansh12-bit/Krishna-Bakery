import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Collection from './components/Collection';
import AICustomizer from './components/AICustomizer';
import OurStory from './components/OurStory';
import Reviews from './components/Reviews';
import ChatButton from './components/ChatButton';
import Footer from './components/Footer';
import OrderModal from './components/OrderModal';
import OrderMenu from './components/OrderMenu';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [highlightProductId, setHighlightProductId] = useState(null);

  function handleProceed(info) {
    setOrderInfo(info);
    setShowModal(false);
    setHighlightProductId(null);
  }

  // Called from ChatButton when user clicks "Order Now" on a product
  // Opens OrderMenu directly (with a default orderInfo) and highlights the product
  function handleChatOrderNow(product) {
    setHighlightProductId(product.id);
    // If orderInfo already set (user already chose address), use it
    // Otherwise open with a default so menu opens immediately
    if (!orderInfo) {
      setOrderInfo({ orderType: "delivery", address: "Current Location" });
    }
  }

  return (
    <div className="bg-[#FAF9F6] text-gray-900">
      <Navbar onOrderClick={() => setShowModal(true)} />
      <Hero onOrderClick={() => setShowModal(true)} />
      <Collection />
      <AICustomizer />
      <OurStory />
      <Reviews />
      <ChatButton onOrderNow={handleChatOrderNow} />
      <Footer />

      {showModal && (
        <OrderModal
          onClose={() => setShowModal(false)}
          onProceed={handleProceed}
        />
      )}

      {orderInfo && (
        <OrderMenu
          orderInfo={orderInfo}
          highlightProductId={highlightProductId}
          onClose={() => { setOrderInfo(null); setHighlightProductId(null); }}
        />
      )}
    </div>
  );
}

export default App;
