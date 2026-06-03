import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "kb_subscribed";

export default function EmailPopup() {
  const [show,    setShow]    = useState(false);
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  useEffect(() => {
    // Already subscribed — never show
    if (localStorage.getItem(STORAGE_KEY)) return;

    // Show after 10 seconds — after auth popup has been seen
    const t1 = setTimeout(() => setShow(true), 10000);
    return () => clearTimeout(t1);
  }, []);

  function handleClose() {
    setShow(false);
    // Show again after 90 seconds if not subscribed
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTimeout(() => setShow(true), 90000);
    }
  }

  async function handleSubscribe() {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // simulate API
    localStorage.setItem(STORAGE_KEY, "1");
    setLoading(false);
    setDone(true);
    setTimeout(() => setShow(false), 2500);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[300] flex items-center justify-center px-4"
          style={{ background: "rgba(10,7,4,0.75)", backdropFilter: "blur(12px)" }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #1e1710 0%, #140f08 100%)",
              border: "1px solid rgba(212,168,67,0.18)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,67,0.06)",
            }}
          >
            {/* Close */}
            <button onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,232,217,0.4)" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(242,232,217,0.8)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(242,232,217,0.4)"}>
              ✕
            </button>

            {/* Top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(212,168,67,0.12) 0%, transparent 70%)", filter: "blur(20px)" }}/>

            <div className="px-7 pt-10 pb-8">
              {!done ? (
                <>
                  {/* Icon */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="text-5xl text-center mb-5">
                    🎂
                  </motion.div>

                  {/* Heading */}
                  <h2 className="text-center text-2xl font-bold mb-2"
                    style={{ fontFamily: "'Playfair Display', serif", color: "var(--ivory, #F2E8D9)" }}>
                    Join Krishna Bakery Club
                  </h2>
                  <p className="text-center text-sm leading-relaxed mb-7"
                    style={{ color: "rgba(242,232,217,0.45)" }}>
                    Get exclusive cake launches, festive offers &amp; premium updates.
                  </p>

                  {/* Divider */}
                  <div className="h-px mb-6"
                    style={{ background: "linear-gradient(to right, transparent, rgba(212,168,67,0.2), transparent)" }}/>

                  {/* Email input */}
                  <div className="relative mb-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSubscribe()}
                      className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "var(--ivory, #F2E8D9)",
                      }}
                      onFocus={e => e.target.style.borderColor = "rgba(212,168,67,0.45)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                    />
                  </div>

                  {/* Subscribe button */}
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(212,168,67,0.25)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubscribe}
                    disabled={loading || !email.trim()}
                    className="w-full py-3.5 rounded-2xl text-sm font-bold uppercase tracking-widest mb-3 relative overflow-hidden transition-all disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #D4A843, #8B6914)", color: "#0a0800" }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"/>
                        Subscribing...
                      </span>
                    ) : (
                      <>
                        <motion.span className="absolute inset-0 -skew-x-12"
                          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}/>
                        <span className="relative">Subscribe →</span>
                      </>
                    )}
                  </motion.button>

                  {/* Maybe later */}
                  <button onClick={handleClose}
                    className="w-full py-2 text-xs transition-all"
                    style={{ color: "rgba(242,232,217,0.25)" }}
                    onMouseEnter={e => e.target.style.color = "rgba(242,232,217,0.5)"}
                    onMouseLeave={e => e.target.style.color = "rgba(242,232,217,0.25)"}>
                    Maybe Later
                  </button>

                  <p className="text-center text-[10px] mt-3" style={{ color: "rgba(242,232,217,0.18)" }}>
                    No spam. Unsubscribe anytime.
                  </p>
                </>
              ) : (
                /* Success state */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="text-5xl mb-4">🎉</motion.div>
                  <h3 className="text-xl font-bold mb-2"
                    style={{ fontFamily: "'Playfair Display', serif", color: "var(--ivory, #F2E8D9)" }}>
                    Welcome to the Club!
                  </h3>
                  <p className="text-sm" style={{ color: "rgba(242,232,217,0.45)" }}>
                    You're now part of Krishna Bakery Club. Exclusive updates coming your way! 🍰
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
