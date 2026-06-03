import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabase";

const REFERRAL_CREDIT = 100; // ₹100 per successful referral

// ── Generate unique referral code ────────────────────────────────────────────
function generateCode(name) {
  const base = (name || "KB").replace(/\s+/g, "").toUpperCase().slice(0, 4);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}${rand}`;
}

function getMyCode(user) {
  const key = `kb_ref_${user?.id || "guest"}`;
  let code = localStorage.getItem(key);
  if (!code) {
    code = generateCode(user?.user_metadata?.full_name || user?.email || "KB");
    localStorage.setItem(key, code);
  }
  return code;
}

function getMyCredits() {
  return parseInt(localStorage.getItem("kb_ref_credits") || "0");
}

// ── Save referral to Supabase (best-effort) ───────────────────────────────────
async function saveReferral(refCode, visitorContact) {
  try {
    await supabase.from("referrals").insert([{
      ref_code:         refCode,
      visitor_contact:  visitorContact,
      status:           "pending",
    }]);
  } catch (e) {
    // table may not exist yet — silent fail
  }
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ReferralSystem({ user, isOpen, onClose }) {
  const [copied,  setCopied]  = useState(false);
  const [credits, setCredits] = useState(getMyCredits());
  const myCode = getMyCode(user);
  const referralLink = `${window.location.origin}?ref=${myCode}`;

  function copyLink() {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function shareWhatsApp() {
    const msg = `🎂 Hey! Order from Krishna Bakers — premium artisan cakes & pastries.\nUse my link for ₹70 OFF on your first order:\n${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0"
            style={{ background: "rgba(8,6,4,0.8)", backdropFilter: "blur(12px)", zIndex: 9999 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 flex items-center justify-center px-4"
            style={{ zIndex: 10000 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full max-w-sm rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #1a1508 0%, #0f0d08 100%)",
                border: "1px solid rgba(212,168,67,0.2)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
              }}>

              {/* Header */}
              <div className="relative px-6 pt-7 pb-5 text-center overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.1) 0%, transparent 70%)" }}/>
                <button onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,232,217,0.4)", cursor: "pointer", zIndex: 9998 }}
                  onMouseEnter={e => e.currentTarget.style.color = "rgba(242,232,217,0.8)"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(242,232,217,0.4)"}>
                  ✕
                </button>
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
                  className="text-4xl mb-3">🎁</motion.div>
                <p className="text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: "rgba(212,168,67,0.6)" }}>
                  Refer & Earn
                </p>
                <h3 className="text-2xl font-bold mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", color: "var(--ivory)" }}>
                  Share & Get ₹{REFERRAL_CREDIT}
                </h3>
                <p className="text-xs" style={{ color: "rgba(242,232,217,0.4)" }}>
                  For every friend who orders, you earn ₹{REFERRAL_CREDIT} credit
                </p>
              </div>

              <div className="px-6 pb-7 space-y-4">
                {/* Credits earned */}
                {credits > 0 && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{ background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.2)" }}>
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="text-xs font-bold" style={{ color: "#D4A843" }}>₹{credits} Credits Earned!</p>
                      <p className="text-[10px]" style={{ color: "rgba(242,232,217,0.4)" }}>Applied on your next order</p>
                    </div>
                  </div>
                )}

                {/* Your code */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(212,168,67,0.5)" }}>
                    Your Referral Code
                  </p>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(212,168,67,0.3)" }}>
                    <span className="flex-1 text-base font-bold tracking-widest" style={{ color: "#D4A843" }}>
                      {myCode}
                    </span>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={copyLink}
                      className="text-xs px-3 py-1.5 rounded-xl font-bold transition"
                      style={copied
                        ? { background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)" }
                        : { background: "rgba(212,168,67,0.1)", color: "#D4A843", border: "1px solid rgba(212,168,67,0.2)" }
                      }>
                      {copied ? "✓ Copied!" : "Copy"}
                    </motion.button>
                  </div>
                </div>

                {/* Share buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={shareWhatsApp}
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold"
                    style={{ background: "#25D366", color: "#fff" }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.727.977.994-3.634-.235-.374A9.818 9.818 0 1112 21.818z"/>
                    </svg>
                    WhatsApp
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={copyLink}
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(242,232,217,0.8)" }}>
                    🔗 Copy Link
                  </motion.button>
                </div>

                {/* How it works */}
                <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(212,168,67,0.5)" }}>How it works</p>
                  {[
                    { icon: "🔗", text: "Share your unique link" },
                    { icon: "🛒", text: "Friend places an order" },
                    { icon: "💰", text: `You earn ₹${REFERRAL_CREDIT} credit` },
                    { icon: "🎂", text: "Use credit on your next order" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3 py-1.5">
                      <span className="text-base w-6 text-center">{s.icon}</span>
                      <p className="text-xs" style={{ color: "rgba(242,232,217,0.5)" }}>{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Hook: detect referral from URL ────────────────────────────────────────────
export function useReferralDetect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("kb_incoming_ref", ref);
      // clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete("ref");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);
}

// ── Apply referral credit when order is placed ────────────────────────────────
export function applyReferralOnOrder(contact) {
  const ref = localStorage.getItem("kb_incoming_ref");
  if (!ref) return;
  saveReferral(ref, contact);
  // Give credit to referrer (stored locally — in production use server)
  const creditKey = `kb_ref_credits`;
  const prev = parseInt(localStorage.getItem(creditKey) || "0");
  localStorage.setItem(creditKey, String(prev + REFERRAL_CREDIT));
  localStorage.removeItem("kb_incoming_ref");
}
