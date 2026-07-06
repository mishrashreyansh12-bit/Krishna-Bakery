import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabase";

function AuthModal({ onClose, onSuccess }) {
  const [tab,      setTab]      = useState("register");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState({ type: "", text: "" });

  async function handleGoogleLogin() {
    if (loading) return;
    setLoading(true);
    setMsg({ type: "", text: "" });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: process.env.REACT_APP_SITE_URL || window.location.origin,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) {
      setMsg({ type: "error", text: "Google login failed: " + error.message });
    }
    setLoading(false);
  }

  async function handleSubmit() {
    if (!email || !password || loading) return;
    setLoading(true);
    setMsg({ type: "", text: "" });

    if (tab === "register") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) {
        const msg = error.message.toLowerCase().includes("rate") || error.message.toLowerCase().includes("too many")
          ? "⏳ Too many attempts. Please wait a minute and try again."
          : error.message;
        setMsg({ type: "error", text: msg });
      } else {
        setMsg({ type: "success", text: "✅ Account created! ₹70 discount applied to your first order." });
        setTimeout(() => {
          onSuccess?.("WELCOME70");
        }, 1800);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const msg = error.message.toLowerCase().includes("rate") || error.message.toLowerCase().includes("too many")
          ? "⏳ Too many attempts. Please wait a minute and try again."
          : error.message;
        setMsg({ type: "error", text: msg });
      } else {
        onSuccess?.();
      }
    }
    setLoading(false);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center px-3 sm:px-4 py-4"
        style={{ background: "rgba(8,7,5,0.92)", backdropFilter: "blur(16px)" }}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 30 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm rounded-2xl sm:rounded-3xl overflow-hidden relative"
          style={{
            background: "linear-gradient(160deg, #1a1508 0%, #0f0d08 100%)",
            border: "1px solid rgba(212,168,67,0.2)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,168,67,0.05)",
            maxHeight: "calc(100vh - 2rem)",
            overflowY: "auto",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white/70 transition"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            ✕
          </button>

          {/* ── TOP OFFER BANNER ── */}
          <div className="relative px-6 pt-5 pb-4 text-center overflow-hidden">
            {/* glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.12) 0%, transparent 70%)" }} />

            {/* gift icon */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="text-4xl mb-2"
            >
              🎁
            </motion.div>

            {/* offer text */}
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="h-px w-8" style={{ background: "linear-gradient(to right, transparent, #D4A843)" }} />
              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400/60">Exclusive Welcome Offer</span>
              <div className="h-px w-8" style={{ background: "linear-gradient(to left, transparent, #D4A843)" }} />
            </div>

            <h2
              className="text-4xl font-bold mb-1"
              style={{
                fontFamily: "'Playfair Display', serif",
                background: "linear-gradient(135deg, #D4A843 0%, #F5D78E 50%, #B8860B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ₹70 OFF
            </h2>
            <p className="text-white/50 text-sm">on your first order · Register to claim</p>

            {/* divider */}
            <div className="mt-5 h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(212,168,67,0.2), transparent)" }} />
          </div>

          {/* ── FORM SECTION ── */}
          <div className="px-5 pb-5 space-y-3">

            {/* Tabs */}
            <div className="flex rounded-xl overflow-hidden p-0.5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {["register", "login"].map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setMsg({ type: "", text: "" }); }}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300"
                  style={
                    tab === t
                      ? { background: "linear-gradient(135deg, #D4A843, #8B6914)", color: "#0D0B08" }
                      : { color: "rgba(255,255,255,0.35)" }
                  }
                >
                  {t === "register" ? "Register" : "Login"}
                </button>
              ))}
            </div>

            {/* Google — prominent */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-semibold transition relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </motion.button>

            {/* divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>or</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* Fields */}
            <div className="space-y-3">
              {tab === "register" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(212,168,67,0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              )}
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={(e) => e.target.style.borderColor = "rgba(212,168,67,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoComplete={tab === "register" ? "new-password" : "current-password"}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                onFocus={(e) => e.target.style.borderColor = "rgba(212,168,67,0.5)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            {/* Message */}
            <AnimatePresence>
              {msg.text && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs px-4 py-2.5 rounded-xl"
                  style={
                    msg.type === "error"
                      ? { background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }
                      : { background: "rgba(34,197,94,0.1)", color: "#86efac", border: "1px solid rgba(34,197,94,0.2)" }
                  }
                >
                  {msg.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(212,168,67,0.25)" }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading || !email || !password}
              className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #D4A843, #8B6914)", color: "#0D0B08" }}
            >
              {loading
                ? "Please wait..."
                : tab === "register"
                  ? "Create Account & Claim ₹70 Off →"
                  : "Login →"
              }
            </motion.button>

            {/* Skip */}
            <button
              onClick={onClose}
              className="w-full text-xs py-1 transition"
              style={{ color: "rgba(255,255,255,0.2)" }}
              onMouseEnter={(e) => e.target.style.color = "rgba(255,255,255,0.45)"}
              onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.2)"}
            >
              Skip for now
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AuthModal;
