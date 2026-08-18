import { useState, useEffect, useRef } from 'react';
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
import EmailPopup  from './components/EmailPopup';
import ReferralSystem, { useReferralDetect } from './components/ReferralSystem';

import { LocationProvider } from './context/LocationContext';

function App() {
  const [showOrderModal,    setShowOrderModal]    = useState(false);
  const [orderInfo,         setOrderInfo]         = useState(null);
  const [highlightProductId,setHighlightProductId]= useState(null);
  const [showAuth,          setShowAuth]          = useState(false);
  const [user,              setUser]              = useState(null);
  const [appliedPromo,      setAppliedPromo]      = useState(null);
  const [jumpCategory,      setJumpCategory]      = useState(null);
  const [showReferral,      setShowReferral]      = useState(false);

  // detect ?ref= in URL
  useReferralDetect();

  // ── Custom cursor ────────────────────────────────────────────────────────
  const cursorRing = useRef(null);
  const cursorDot  = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (cursorDot.current) {
        cursorDot.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };
    window.addEventListener("mousemove", move);

    let raf;
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (cursorRing.current) {
        cursorRing.current.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onEnter = () => { if (cursorRing.current) cursorRing.current.style.transform += " scale(1.6)"; };
    const onLeave = () => { if (cursorRing.current) cursorRing.current.style.transform = cursorRing.current.style.transform.replace(" scale(1.6)", ""); };
    document.querySelectorAll("a,button").forEach(el => { el.addEventListener("mouseenter", onEnter); el.addEventListener("mouseleave", onLeave); });

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

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

  // ── ₹60 Auth popup — har page load/reload pe ek baar ───────────────────
  useEffect(() => {
    if (user) return;

    // Har load pe dikhao — bas ek baar per load (in-memory flag)
    const timer = setTimeout(() => {
      setShowAuth(true);
    }, 1500);

    return () => clearTimeout(timer);
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

  function handleChatOrderNow(product, chatUserData) {
    setHighlightProductId(product.id);
    if (!orderInfo) {
      setOrderInfo({
        orderType: chatUserData?.orderType || "delivery",
        address: chatUserData?.address || "Krishna Bakers Store",
        customerName: chatUserData?.name || "",
        contact: chatUserData?.contact || "",
        email: "",
      });
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
    <LocationProvider>
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ivory)", cursor: "none" }}>

      {/* ── Custom cursor ── */}
      <div ref={cursorRing} className="fixed z-[9999] pointer-events-none"
        style={{ width: 36, height: 36, top: 0, left: 0, borderRadius: "50%", border: "1.5px solid rgba(139,94,60,0.5)", transition: "transform 0.08s ease" }}/>
      <div ref={cursorDot} className="fixed z-[9999] pointer-events-none"
        style={{ width: 8, height: 8, top: 0, left: 0, borderRadius: "50%", background: "#8B5E3C", transition: "transform 0.02s linear" }}/>
      <Navbar
        onOrderClick={() => setShowOrderModal(true)}
        onLoginClick={() => setShowAuth(true)}
        user={user}
        onLogout={handleLogout}
        onCategoryClick={(cat) => {
          setJumpCategory(cat);
          document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <Hero onOrderClick={() => setShowOrderModal(true)} />
      <Collection onProductClick={handleProductClick} jumpCategory={jumpCategory} onJumpDone={() => setJumpCategory(null)} />
      <AICustomizer />
      <OurStory />
      <Reviews />

      <ChatButton onOrderNow={handleChatOrderNow} />

      {/* Referral floating button */}
      <motion.button
        onClick={() => setShowReferral(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-8 left-8 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #1a0f00, #3d1f00)",
          border: "1px solid rgba(212,168,67,0.25)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
        title="Refer & Earn ₹100"
      >
        <span className="text-base">🎁</span>
        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block"
          style={{ color: "rgba(212,168,67,0.8)" }}>
          Refer & Earn
        </span>
      </motion.button>

      {/* Referral Modal */}
      <ReferralSystem
        user={user}
        isOpen={showReferral}
        onClose={() => setShowReferral(false)}
      />
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

      {/* Email Subscribe Popup */}
      <EmailPopup />

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
    </LocationProvider>
  );
}

export default App;
