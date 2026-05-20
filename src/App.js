import { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabase';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar      from './components/Navbar';
import Hero        from './components/Hero';
import Collection  from './components/Collection';
import AICustomizer from './components/AICustomizer';
import OurStory    from './components/OurStory';
import Reviews     from './components/Reviews';
import ChatButton  from './components/ChatButton';
import Footer      from './components/Footer';
import OrderModal  from './components/OrderModal';
import OrderMenu   from './components/OrderMenu';
import AuthModal   from './components/AuthModal';

function App() {
  const [showOrderModal,    setShowOrderModal]    = useState(false);
  const [orderInfo,         setOrderInfo]         = useState(null);
  const [highlightProductId,setHighlightProductId]= useState(null);
  const [showAuth,          setShowAuth]          = useState(false);
  const [user,              setUser]              = useState(null);
  const [appliedPromo,      setAppliedPromo]      = useState(null);

  // ── Auth state listener ──────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Show login popup on every visit if not logged in ────────────────────
  useEffect(() => {
    if (!user) {
      const t = setTimeout(() => setShowAuth(true), 1000);
      return () => clearTimeout(t);
    }
  }, [user]);

  function handleProceed(info) {
    setOrderInfo(info);
    setShowOrderModal(false);
    setHighlightProductId(null);
  }

  function handleProductClick(productId) {
    setHighlightProductId(productId);
    setShowOrderModal(true);
  }

  function handleChatOrderNow(product) {
    setHighlightProductId(product.id);
    if (!orderInfo) {
      setOrderInfo({ orderType: "delivery", address: "Current Location", customerName: "", contact: "", email: "" });
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  function handleAuthSuccess(promoCode) {
    if (promoCode) setAppliedPromo(promoCode);
    setShowAuth(false);
  }

  return (
    <div className="bg-[#0D0B08] text-white min-h-screen">
      <Navbar
        onOrderClick={() => setShowOrderModal(true)}
        onLoginClick={() => setShowAuth(true)}
        user={user}
        onLogout={handleLogout}
      />

      <Hero onOrderClick={() => setShowOrderModal(true)} />
      <Collection onProductClick={handleProductClick} />
      <AICustomizer />
      <OurStory />
      <Reviews />

      {/* WhatsApp floating button */}
      <motion.a
        href="https://wa.me/919131401594?text=Hi%20Krishna%20Bakers!%20I'd%20like%20to%20place%20an%20order."
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-28 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{ background: "#25D366" }}
        title="Chat on WhatsApp"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.727.977.994-3.634-.235-.374A9.818 9.818 0 1112 21.818z"/>
        </svg>
      </motion.a>

      <ChatButton onOrderNow={handleChatOrderNow} />
      <Footer />

      {/* Order Modal */}
      <AnimatePresence>
        {showOrderModal && (
          <OrderModal
            onClose={() => setShowOrderModal(false)}
            onProceed={handleProceed}
            initialPromo={appliedPromo}
          />
        )}
      </AnimatePresence>

      {/* Order Menu */}
      {orderInfo && (
        <OrderMenu
          orderInfo={orderInfo}
          highlightProductId={highlightProductId}
          initialPromo={appliedPromo}
          onClose={() => { setOrderInfo(null); setHighlightProductId(null); }}
        />
      )}

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
