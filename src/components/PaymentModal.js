import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Your UPI Details — change these ──────────────────────────────────────────
const UPI_ID    = "9131401594@ybl";        // UPI ID
const UPI_NAME  = "Krishna Bakers";
const PHONE_NO  = "919131401594";          // with country code

// ── Generate UPI deep link ────────────────────────────────────────────────────
function getUpiLink(amount, orderId) {
  const note = encodeURIComponent(`Krishna Bakers Order #${orderId}`);
  const name = encodeURIComponent(UPI_NAME);
  return `upi://pay?pa=${UPI_ID}&pn=${name}&am=${amount}&cu=INR&tn=${note}`;
}

// ── Generate QR code URL (using free QR API) ──────────────────────────────────
function getQrUrl(amount, orderId) {
  const upiLink = getUpiLink(amount, orderId);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
}

const UPI_APPS = [
  { id: "gpay",    name: "Google Pay",  icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png",  color: "#4285F4" },
  { id: "phonepe", name: "PhonePe",     icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png",        color: "#5F259F" },
  { id: "paytm",   name: "Paytm",       icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Paytm_logo.png/512px-Paytm_logo.png",                color: "#002970" },
  { id: "bhim",    name: "BHIM UPI",    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/BHIM_svg_logo.svg/512px-BHIM_svg_logo.svg.png",      color: "#00529C" },
];

export default function PaymentModal({ isOpen, onClose, amount, orderId, orderInfo, onPaymentDone }) {
  const [tab,          setTab]          = useState("qr");   // qr | upi | apps
  const [upiInput,     setUpiInput]     = useState("");
  const [txnId,        setTxnId]        = useState("");
  const [step,         setStep]         = useState("pay");  // pay | confirm | done
  const [loading,      setLoading]      = useState(false);
  const [qrLoaded,     setQrLoaded]     = useState(false);
  const shortId = (orderId || "XXXXXX").toString().slice(-6).toUpperCase();
  const qrUrl   = getQrUrl(amount, shortId);
  const upiLink = getUpiLink(amount, shortId);

  // reset on open
  useEffect(() => {
    if (isOpen) { setStep("pay"); setTxnId(""); setUpiInput(""); setQrLoaded(false); }
  }, [isOpen]);

  function handlePaymentDone() {
    if (!txnId.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("done");
      setTimeout(() => {
        onPaymentDone?.(txnId.trim());
        onClose?.();
      }, 2500);
    }, 1200);
  }

  function copyUpiId() {
    navigator.clipboard.writeText(UPI_ID).catch(() => {});
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300]"
            style={{ background: "rgba(8,6,4,0.88)", backdropFilter: "blur(16px)" }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[301] flex items-center justify-center px-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full max-w-sm rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #1a1508 0%, #0f0d08 100%)",
                border: "1px solid rgba(212,168,67,0.2)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.7)",
              }}>

              {/* Header */}
              <div className="relative px-6 pt-6 pb-4"
                style={{ borderBottom: "1px solid rgba(212,168,67,0.1)" }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.08) 0%, transparent 70%)" }}/>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(212,168,67,0.5)" }}>Secure Payment</p>
                    <h3 className="text-base font-bold" style={{ color: "var(--ivory)", fontFamily: "'Playfair Display', serif" }}>
                      Pay ₹{amount}
                    </h3>
                    <p className="text-[10px] mt-0.5" style={{ color: "rgba(242,232,217,0.35)" }}>
                      Order #{shortId} · {orderInfo?.orderType === "delivery" ? "Delivery" : "Pickup"}
                    </p>
                  </div>
                  <button onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,232,217,0.4)", zIndex: 9998 }}
                    onMouseEnter={e => e.currentTarget.style.color = "rgba(242,232,217,0.8)"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(242,232,217,0.4)"}>
                    ✕
                  </button>
                </div>

                {/* Amount badge */}
                <div className="mt-3 flex items-center gap-3 px-4 py-2.5 rounded-2xl"
                  style={{ background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.2)" }}>
                  <span className="text-xl">💰</span>
                  <div>
                    <p className="text-lg font-bold" style={{ color: "#D4A843" }}>₹{amount}</p>
                    <p className="text-[9px]" style={{ color: "rgba(242,232,217,0.4)" }}>Total payable · GST included</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <span className="text-[9px] px-2 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>
                      🔒 Secure
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5">
                <AnimatePresence mode="wait">

                  {/* ── Step: pay ── */}
                  {step === "pay" && (
                    <motion.div key="pay" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                      {/* Tab switcher */}
                      <div className="flex gap-1 p-1 rounded-2xl mb-5"
                        style={{ background: "rgba(255,255,255,0.04)" }}>
                        {[
                          { id: "qr",   label: "📱 QR Code" },
                          { id: "upi",  label: "🔗 UPI ID"  },
                          { id: "apps", label: "📲 Apps"    },
                        ].map(t => (
                          <button key={t.id} onClick={() => setTab(t.id)}
                            className="flex-1 py-2 rounded-xl text-[10px] font-bold transition-all"
                            style={tab === t.id
                              ? { background: "linear-gradient(135deg,rgba(212,168,67,0.2),rgba(139,105,20,0.15))", color: "#D4A843", border: "1px solid rgba(212,168,67,0.3)" }
                              : { color: "rgba(242,232,217,0.35)", border: "1px solid transparent" }
                            }>
                            {t.label}
                          </button>
                        ))}
                      </div>

                      {/* QR Tab */}
                      {tab === "qr" && (
                        <div className="text-center space-y-3">
                          <p className="text-xs" style={{ color: "rgba(242,232,217,0.4)" }}>
                            Scan with any UPI app
                          </p>
                          <div className="flex justify-center">
                            <div className="p-3 rounded-2xl bg-white relative"
                              style={{ border: "3px solid rgba(212,168,67,0.4)", boxShadow: "0 0 30px rgba(212,168,67,0.15)" }}>
                              {!qrLoaded && (
                                <div className="w-[200px] h-[200px] flex items-center justify-center">
                                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="w-8 h-8 rounded-full border-2 border-t-transparent border-amber-400"/>
                                </div>
                              )}
                              <img
                                src={qrUrl}
                                alt="UPI QR Code"
                                className={`w-[200px] h-[200px] ${qrLoaded ? "block" : "hidden"}`}
                                onLoad={() => setQrLoaded(true)}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <span className="text-xs font-mono font-bold" style={{ color: "#D4A843" }}>{UPI_ID}</span>
                            <button onClick={copyUpiId} className="text-[9px] px-2 py-1 rounded-lg"
                              style={{ background: "rgba(212,168,67,0.1)", color: "rgba(212,168,67,0.7)" }}>
                              Copy
                            </button>
                          </div>
                          <p className="text-[9px]" style={{ color: "rgba(242,232,217,0.25)" }}>
                            Google Pay · PhonePe · Paytm · BHIM · Any UPI app
                          </p>
                        </div>
                      )}

                      {/* UPI ID Tab */}
                      {tab === "upi" && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                            style={{ background: "rgba(212,168,67,0.06)", border: "1px solid rgba(212,168,67,0.2)" }}>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(212,168,67,0.5)" }}>Pay to UPI ID</p>
                              <p className="text-sm font-bold font-mono" style={{ color: "#D4A843" }}>{UPI_ID}</p>
                              <p className="text-[10px]" style={{ color: "rgba(242,232,217,0.4)" }}>{UPI_NAME}</p>
                            </div>
                            <button onClick={copyUpiId}
                              className="ml-auto text-[10px] font-bold px-3 py-1.5 rounded-xl transition"
                              style={{ background: "rgba(212,168,67,0.1)", color: "#D4A843", border: "1px solid rgba(212,168,67,0.2)" }}>
                              📋 Copy
                            </button>
                          </div>

                          {/* Direct UPI link */}
                          <a href={upiLink}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-bold transition"
                            style={{ background: "rgba(212,168,67,0.1)", color: "#D4A843", border: "1px solid rgba(212,168,67,0.2)" }}>
                            🔗 Open in UPI App
                          </a>

                          <div className="text-center">
                            <p className="text-[9px]" style={{ color: "rgba(242,232,217,0.25)" }}>
                              Opens your default UPI app automatically
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Apps Tab */}
                      {tab === "apps" && (
                        <div className="space-y-2">
                          {UPI_APPS.map(app => (
                            <a key={app.id} href={upiLink}
                              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all no-underline"
                              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,168,67,0.3)"}
                              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
                              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-white flex items-center justify-center p-1">
                                <img src={app.icon} alt={app.name} className="w-full h-full object-contain"
                                  onError={e => { e.target.style.display = "none"; e.target.parentNode.innerHTML = `<span style="font-size:20px">💳</span>`; }}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-semibold" style={{ color: "var(--ivory)" }}>{app.name}</p>
                                <p className="text-[9px]" style={{ color: "rgba(242,232,217,0.35)" }}>Pay ₹{amount}</p>
                              </div>
                              <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                              </svg>
                            </a>
                          ))}
                        </div>
                      )}

                      {/* After payment confirmation */}
                      <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(212,168,67,0.5)" }}>
                          After payment, enter Transaction ID
                        </p>
                        <div className="flex gap-2">
                          <input type="text" placeholder="e.g. 407891234567"
                            value={txnId}
                            onChange={e => setTxnId(e.target.value)}
                            className="flex-1 rounded-xl px-3 py-2.5 text-xs outline-none"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(242,232,217,0.9)" }}
                            onFocus={e => e.target.style.borderColor = "rgba(212,168,67,0.5)"}
                            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                          />
                          <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                            onClick={handlePaymentDone}
                            disabled={!txnId.trim() || loading}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 whitespace-nowrap"
                            style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}>
                            {loading ? (
                              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"/>
                            ) : "Confirm →"}
                          </motion.button>
                        </div>
                        <p className="text-[9px] mt-2" style={{ color: "rgba(242,232,217,0.2)" }}>
                          UTR / Transaction ID found in payment app
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Step: done ── */}
                  {step === "done" && (
                    <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6">
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                        className="text-5xl mb-4">🎉</motion.div>
                      <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "var(--ivory)" }}>
                        Payment Confirmed!
                      </h3>
                      <p className="text-xs mb-1" style={{ color: "rgba(242,232,217,0.5)" }}>
                        Transaction ID: <span style={{ color: "#D4A843" }}>{txnId}</span>
                      </p>
                      <p className="text-xs" style={{ color: "rgba(242,232,217,0.4)" }}>
                        Your order is confirmed. We'll contact you shortly! 🎂
                      </p>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 pb-5">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }}/>
                  <p className="text-[9px] flex items-center gap-1" style={{ color: "rgba(242,232,217,0.2)" }}>
                    🔒 100% Secure UPI Payment
                  </p>
                  <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }}/>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
