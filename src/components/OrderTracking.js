import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getOrderById } from "../services/orderService";

const TRACKING_STEPS = [
  { key: "confirmed",        icon: "✅", label: "Order Confirmed",     desc: "We've received your order!" },
  { key: "preparing",        icon: "👨‍🍳", label: "Being Prepared",      desc: "Our bakers are crafting your order" },
  { key: "out_for_delivery", icon: "🚚", label: "Out for Delivery",    desc: "On the way to you!" },
  { key: "delivered",        icon: "🎉", label: "Delivered",           desc: "Enjoy your treats!" },
];

function getStepIndex(status) {
  return TRACKING_STEPS.findIndex(s => s.key === status);
}

export default function OrderTracking({ orderId, onClose }) {
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    getOrderById(orderId).then(data => {
      if (data) setOrder(data);
      else setError("Order not found. Please check your order ID.");
      setLoading(false);
    });
  }, [orderId]);

  const stepIdx = order ? getStepIndex(order.tracking_status || "confirmed") : 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: "rgba(8,6,4,0.85)", backdropFilter: "blur(16px)" }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1a1508 0%, #0f0d08 100%)",
          border: "1px solid rgba(212,168,67,0.2)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(212,168,67,0.1)" }}>
          <div>
            <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(212,168,67,0.5)" }}>
              Order Tracking
            </p>
            <h3 className="text-base font-bold" style={{ color: "var(--ivory)", fontFamily: "'Playfair Display', serif" }}>
              Track Your Order
            </h3>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,232,217,0.4)" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(242,232,217,0.8)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(242,232,217,0.4)"}>
            ✕
          </button>
        </div>

        <div className="px-6 py-6">
          {loading ? (
            <div className="flex flex-col items-center py-12 gap-4">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-full border-2 border-t-transparent"
                style={{ borderColor: "rgba(212,168,67,0.4)", borderTopColor: "transparent" }}/>
              <p className="text-sm" style={{ color: "rgba(242,232,217,0.4)" }}>Loading order details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-sm" style={{ color: "rgba(242,232,217,0.5)" }}>{error}</p>
            </div>
          ) : order ? (
            <div className="space-y-6">
              {/* Order info */}
              <div className="rounded-2xl p-4"
                style={{ background: "rgba(212,168,67,0.06)", border: "1px solid rgba(212,168,67,0.15)" }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-bold" style={{ color: "#D4A843" }}>
                      #{order.id?.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "rgba(242,232,217,0.4)" }}>
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>
                    {order.tracking_status?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Confirmed"}
                  </span>
                </div>
                <p className="text-xs mb-1" style={{ color: "rgba(242,232,217,0.5)" }}>
                  📍 {order.address}
                </p>
                {order.delivery_date && (
                  <p className="text-xs" style={{ color: "rgba(212,168,67,0.6)" }}>
                    📅 Delivery: {order.delivery_date}
                  </p>
                )}
                <div className="mt-3 pt-3 flex items-center justify-between"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-xs" style={{ color: "rgba(242,232,217,0.4)" }}>
                    {order.items?.length || 0} items
                  </p>
                  <p className="text-sm font-bold" style={{ color: "#D4A843" }}>₹{order.total}</p>
                </div>
              </div>

              {/* Tracking steps */}
              <div className="space-y-0">
                {TRACKING_STEPS.map((step, i) => {
                  const isDone    = i <= stepIdx;
                  const isCurrent = i === stepIdx;
                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      {/* line + dot */}
                      <div className="flex flex-col items-center">
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: isCurrent ? [1, 1.15, 1] : 1 }}
                          transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
                          style={{
                            background: isDone
                              ? "linear-gradient(135deg,#D4A843,#8B6914)"
                              : "rgba(255,255,255,0.06)",
                            border: isCurrent ? "2px solid #D4A843" : "1px solid rgba(255,255,255,0.1)",
                            boxShadow: isCurrent ? "0 0 16px rgba(212,168,67,0.3)" : "none",
                          }}>
                          {isDone ? step.icon : <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>{i + 1}</span>}
                        </motion.div>
                        {i < TRACKING_STEPS.length - 1 && (
                          <div className="w-0.5 h-8 mt-1"
                            style={{ background: i < stepIdx ? "rgba(212,168,67,0.4)" : "rgba(255,255,255,0.06)" }}/>
                        )}
                      </div>
                      {/* text */}
                      <div className="pb-6">
                        <p className="text-sm font-semibold"
                          style={{ color: isDone ? "var(--ivory)" : "rgba(242,232,217,0.3)" }}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-xs mt-0.5" style={{ color: "rgba(212,168,67,0.6)" }}>
                            {step.desc}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Items list */}
              {order.items && order.items.length > 0 && (
                <div className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-[10px] uppercase tracking-widest px-4 py-2.5 font-semibold"
                    style={{ background: "rgba(255,255,255,0.03)", color: "rgba(242,232,217,0.4)" }}>
                    Items Ordered
                  </p>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2.5 border-t"
                      style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                      <p className="text-xs" style={{ color: "rgba(242,232,217,0.7)" }}>
                        {item.name} × {item.qty}
                      </p>
                      <p className="text-xs font-semibold" style={{ color: "#D4A843" }}>
                        ₹{item.price * item.qty}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* WhatsApp support */}
              <a href={`https://wa.me/919131401594?text=Hi%20Krishna%20Bakers!%20I%20need%20help%20with%20my%20order%20%23${order.id?.slice(0, 8).toUpperCase()}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition"
                style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)", color: "#4ade80" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(37,211,102,0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(37,211,102,0.1)"}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.727.977.994-3.634-.235-.374A9.818 9.818 0 1112 21.818z"/>
                </svg>
                Need help? Chat on WhatsApp
              </a>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
