import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getOrdersByContact, getOrderById } from "../services/orderService";

// ── Local storage helpers ─────────────────────────────────────────────────────
const STORAGE_KEY_ADDRESSES = "kb_addresses";
const STORAGE_KEY_POINTS    = "kb_points";
const STORAGE_KEY_BIRTHDAY  = "kb_birthday";
const STORAGE_KEY_CONTACT   = "kb_contact"; // saved from last order

function getAddresses() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_ADDRESSES) || "[]"); } catch { return []; }
}
function getPoints() {
  return parseInt(localStorage.getItem(STORAGE_KEY_POINTS) || "0");
}
function getBirthday() {
  return localStorage.getItem(STORAGE_KEY_BIRTHDAY) || "";
}
function getSavedContact() {
  return localStorage.getItem(STORAGE_KEY_CONTACT) || "";
}

// ── Status color helper ───────────────────────────────────────────────────────
function statusStyle(status) {
  const s = (status || "pending").toLowerCase();
  if (s === "delivered")        return { bg: "rgba(34,197,94,0.12)",  color: "#4ade80" };
  if (s === "out_for_delivery") return { bg: "rgba(59,130,246,0.12)", color: "#60a5fa" };
  if (s === "preparing")        return { bg: "rgba(234,179,8,0.12)",  color: "#fbbf24" };
  return                               { bg: "rgba(212,168,67,0.12)", color: "#D4A843" };
}

// ── Tab components ────────────────────────────────────────────────────────────

function OrderHistory({ user }) {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState(getSavedContact());
  const [inputContact, setInputContact] = useState("");
  const [showTracking, setShowTracking] = useState(null);

  // fetch on mount if contact known
  useEffect(() => {
    if (contact) fetchOrders(contact);
    else setLoading(false);
  }, [contact]);

  // also try user email
  useEffect(() => {
    if (user?.email && !contact) {
      setContact(user.email);
    }
  }, [user]);

  async function fetchOrders(c) {
    setLoading(true);
    const data = await getOrdersByContact(c);
    // also update points from real orders
    if (data.length > 0) {
      const totalSpent = data.reduce((s, o) => s + (o.total || 0), 0);
      const pts = Math.floor(totalSpent / 100) * 10;
      localStorage.setItem(STORAGE_KEY_POINTS, String(pts));
    }
    setOrders(data);
    setLoading(false);
  }

  function handleSearch() {
    if (!inputContact.trim()) return;
    const c = inputContact.trim();
    localStorage.setItem(STORAGE_KEY_CONTACT, c);
    setContact(c);
    setInputContact("");
  }

  if (loading) return (
    <div className="flex flex-col items-center py-16 gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 rounded-full border-2 border-t-transparent"
        style={{ borderColor: "rgba(212,168,67,0.4)", borderTopColor: "transparent" }}/>
      <p className="text-xs" style={{ color: "rgba(242,232,217,0.4)" }}>Fetching your orders...</p>
    </div>
  );

  if (!contact) return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="text-4xl mb-4">📦</div>
      <p className="text-sm font-semibold mb-1" style={{ color: "rgba(242,232,217,0.7)" }}>Find Your Orders</p>
      <p className="text-xs mb-5" style={{ color: "rgba(242,232,217,0.3)" }}>Enter your phone or email used while ordering</p>
      <div className="w-full flex gap-2">
        <input type="text" placeholder="Phone or email..."
          value={inputContact} onChange={e => setInputContact(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(242,232,217,0.9)" }}
          onFocus={e => e.target.style.borderColor = "rgba(212,168,67,0.5)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />
        <button onClick={handleSearch}
          className="px-4 py-2.5 rounded-xl text-xs font-bold"
          style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}>
          Search
        </button>
      </div>
    </div>
  );

  if (orders.length === 0) return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="text-4xl mb-3">🔍</div>
      <p className="text-sm font-semibold mb-1" style={{ color: "rgba(242,232,217,0.7)" }}>No orders found</p>
      <p className="text-xs mb-4" style={{ color: "rgba(242,232,217,0.3)" }}>for {contact}</p>
      <button onClick={() => { setContact(""); localStorage.removeItem(STORAGE_KEY_CONTACT); }}
        className="text-xs px-4 py-2 rounded-full transition"
        style={{ border: "1px solid rgba(212,168,67,0.3)", color: "rgba(212,168,67,0.6)" }}>
        Try different contact
      </button>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* contact badge */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px]" style={{ color: "rgba(242,232,217,0.35)" }}>
          Showing orders for <span style={{ color: "#D4A843" }}>{contact}</span>
        </p>
        <button onClick={() => { setContact(""); setOrders([]); localStorage.removeItem(STORAGE_KEY_CONTACT); }}
          className="text-[10px] transition" style={{ color: "rgba(242,232,217,0.25)" }}
          onMouseEnter={e => e.target.style.color = "rgba(242,232,217,0.6)"}
          onMouseLeave={e => e.target.style.color = "rgba(242,232,217,0.25)"}>
          Change
        </button>
      </div>

      {orders.map((order) => {
        const style = statusStyle(order.tracking_status || order.status);
        const date  = new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
        return (
          <motion.div key={order.id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs font-bold" style={{ color: "var(--ivory)" }}>
                  #{order.id?.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(242,232,217,0.4)" }}>{date}</p>
                {order.delivery_date && (
                  <p className="text-[10px]" style={{ color: "rgba(212,168,67,0.5)" }}>📅 {order.delivery_date}</p>
                )}
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full font-semibold"
                style={{ background: style.bg, color: style.color }}>
                {(order.tracking_status || order.status || "Pending").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
              </span>
            </div>
            <p className="text-xs mb-2 line-clamp-1" style={{ color: "rgba(242,232,217,0.5)" }}>
              {order.items?.map(it => it.name).join(", ") || "Krishna Bakers Order"}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold" style={{ color: "#D4A843" }}>₹{order.total}</p>
              <button
                onClick={() => setShowTracking(order.id)}
                className="text-[10px] px-3 py-1 rounded-full transition"
                style={{ border: "1px solid rgba(212,168,67,0.3)", color: "rgba(212,168,67,0.7)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(212,168,67,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                🔍 Track
              </button>
            </div>
          </motion.div>
        );
      })}

      {/* inline tracking */}
      {showTracking && (
        <div className="fixed inset-0 z-[300]">
          {/* lazy import to avoid circular */}
          <TrackingInline orderId={showTracking} onClose={() => setShowTracking(null)} />
        </div>
      )}
    </div>
  );
}

// ── Inline tracking (avoids circular import) ──────────────────────────────────
function TrackingInline({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  useEffect(() => {
    getOrderById(orderId).then(setOrder);
  }, [orderId]);

  const STEPS = [
    { key: "confirmed",        icon: "✅", label: "Confirmed"       },
    { key: "preparing",        icon: "👨‍🍳", label: "Preparing"       },
    { key: "out_for_delivery", icon: "🚚", label: "Out for Delivery" },
    { key: "delivered",        icon: "🎉", label: "Delivered"        },
  ];
  const stepIdx = STEPS.findIndex(s => s.key === (order?.tracking_status || "confirmed"));

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4"
      style={{ background: "rgba(8,6,4,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl p-6"
        style={{ background: "linear-gradient(160deg,#1a1508,#0f0d08)", border: "1px solid rgba(212,168,67,0.2)" }}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold" style={{ color: "var(--ivory)", fontFamily: "'Playfair Display', serif" }}>
            Order #{orderId?.slice(0, 8).toUpperCase()}
          </p>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,232,217,0.4)" }}>✕</button>
        </div>
        {!order ? (
          <div className="flex justify-center py-8">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-full border-2 border-t-transparent"
              style={{ borderColor: "rgba(212,168,67,0.4)", borderTopColor: "transparent" }}/>
          </div>
        ) : (
          <div className="space-y-3">
            {STEPS.map((step, i) => {
              const done = i <= stepIdx;
              const curr = i === stepIdx;
              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                    style={{
                      background: done ? "linear-gradient(135deg,#D4A843,#8B6914)" : "rgba(255,255,255,0.06)",
                      boxShadow: curr ? "0 0 12px rgba(212,168,67,0.4)" : "none",
                    }}>
                    {done ? step.icon : <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>{i+1}</span>}
                  </div>
                  <p className="text-sm" style={{ color: done ? "var(--ivory)" : "rgba(242,232,217,0.25)" }}>
                    {step.label}
                    {curr && <span className="ml-2 text-[10px]" style={{ color: "#D4A843" }}>← Current</span>}
                  </p>
                </div>
              );
            })}
            <div className="mt-4 pt-4 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs" style={{ color: "rgba(242,232,217,0.4)" }}>Total: <span style={{ color: "#D4A843" }}>₹{order.total}</span></p>
              <a href={`https://wa.me/919131401594?text=Order%20help%20%23${orderId?.slice(0,8).toUpperCase()}`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-full"
                style={{ background: "rgba(37,211,102,0.1)", color: "#4ade80", border: "1px solid rgba(37,211,102,0.2)" }}>
                WhatsApp Help
              </a>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function SavedAddresses() {
  const [addresses, setAddresses] = useState(getAddresses());
  const [adding, setAdding] = useState(false);
  const [newAddr, setNewAddr] = useState("");

  function addAddress() {
    if (!newAddr.trim()) return;
    const updated = [...addresses, { id: Date.now(), label: "Home", address: newAddr.trim() }];
    localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(updated));
    setAddresses(updated);
    setNewAddr("");
    setAdding(false);
  }

  function removeAddress(id) {
    const updated = addresses.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(updated));
    setAddresses(updated);
  }

  return (
    <div className="space-y-3">
      {addresses.length === 0 && !adding && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="text-4xl mb-3">📍</div>
          <p className="text-sm font-semibold mb-1" style={{ color: "rgba(242,232,217,0.7)" }}>No saved addresses</p>
          <p className="text-xs mb-4" style={{ color: "rgba(242,232,217,0.3)" }}>Save your delivery addresses for faster checkout</p>
        </div>
      )}

      {addresses.map(addr => (
        <div key={addr.id} className="flex items-start gap-3 rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <span className="text-lg mt-0.5">📍</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold mb-0.5" style={{ color: "#D4A843" }}>{addr.label}</p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(242,232,217,0.5)" }}>{addr.address}</p>
          </div>
          <button onClick={() => removeAddress(addr.id)}
            className="text-xs shrink-0 transition"
            style={{ color: "rgba(255,255,255,0.2)" }}
            onMouseEnter={e => e.target.style.color = "#ef4444"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.2)"}>
            ✕
          </button>
        </div>
      ))}

      {adding ? (
        <div className="rounded-2xl p-4 space-y-3"
          style={{ background: "rgba(212,168,67,0.06)", border: "1px solid rgba(212,168,67,0.2)" }}>
          <input type="text" placeholder="Enter full address..." value={newAddr}
            onChange={e => setNewAddr(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addAddress()}
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(242,232,217,0.9)" }}
            onFocus={e => e.target.style.borderColor = "rgba(212,168,67,0.5)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            autoFocus
          />
          <div className="flex gap-2">
            <button onClick={addAddress}
              className="flex-1 py-2 rounded-xl text-xs font-bold"
              style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}>
              Save Address
            </button>
            <button onClick={() => { setAdding(false); setNewAddr(""); }}
              className="px-4 py-2 rounded-xl text-xs transition"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          className="w-full py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition"
          style={{ border: "1px dashed rgba(212,168,67,0.3)", color: "rgba(212,168,67,0.6)" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,168,67,0.6)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(212,168,67,0.3)"}>
          <span className="text-base">+</span> Add New Address
        </button>
      )}
    </div>
  );
}

function LoyaltyPoints({ user }) {
  const [points, setPoints] = useState(getPoints());

  // refresh points when tab becomes active
  useEffect(() => {
    setPoints(getPoints());
  }, []);

  const level  = points >= 500 ? "Gold" : points >= 200 ? "Silver" : "Bronze";
  const levelColor = level === "Gold" ? "#D4A843" : level === "Silver" ? "#94a3b8" : "#cd7f32";
  const nextLevel  = level === "Bronze" ? 200 : level === "Silver" ? 500 : 1000;
  const progress   = Math.min((points / nextLevel) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Points card */}
      <div className="rounded-2xl p-6 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(212,168,67,0.12) 0%, rgba(139,105,20,0.08) 100%)", border: "1px solid rgba(212,168,67,0.25)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.1) 0%, transparent 70%)" }}/>
        <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(212,168,67,0.6)" }}>Your Points</p>
        <p className="text-5xl font-bold mb-1" style={{ color: "#D4A843" }}>{points}</p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
          style={{ background: `${levelColor}18`, border: `1px solid ${levelColor}40` }}>
          <span className="text-sm">👑</span>
          <span className="text-xs font-bold" style={{ color: levelColor }}>{level} Member</span>
        </div>
        {/* progress bar */}
        <div className="text-left">
          <div className="flex justify-between text-[10px] mb-1.5" style={{ color: "rgba(242,232,217,0.4)" }}>
            <span>{points} pts</span>
            <span>{nextLevel} pts for next level</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div className="h-full rounded-full"
              style={{ background: `linear-gradient(to right, ${levelColor}, #F5D78E)` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* How to earn */}
      <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-xs font-bold mb-3" style={{ color: "rgba(242,232,217,0.6)" }}>How to earn points</p>
        {[
          { icon: "🛒", text: "Every ₹100 spent = 10 points" },
          { icon: "⭐", text: "Write a review = 25 points" },
          { icon: "🎂", text: "Birthday order = 2x points" },
          { icon: "👥", text: "Refer a friend = 100 points" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <span className="text-base">{item.icon}</span>
            <p className="text-xs" style={{ color: "rgba(242,232,217,0.5)" }}>{item.text}</p>
          </div>
        ))}
      </div>

      {/* Redeem */}
      <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-xs font-bold mb-3" style={{ color: "rgba(242,232,217,0.6)" }}>Redeem points</p>
        <p className="text-xs mb-3" style={{ color: "rgba(242,232,217,0.35)" }}>100 points = ₹10 discount on your next order</p>
        <button disabled={points < 100}
          className="w-full py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}>
          Redeem {Math.floor(points / 100) * 100} pts → ₹{Math.floor(points / 100) * 10} OFF
        </button>
      </div>
    </div>
  );
}

function BirthdayReminder({ user }) {
  const [birthday, setBirthday] = useState(getBirthday());
  const [saved, setSaved] = useState(!!getBirthday());
  const [editing, setEditing] = useState(!getBirthday());

  function saveBirthday() {
    if (!birthday) return;
    localStorage.setItem(STORAGE_KEY_BIRTHDAY, birthday);
    setSaved(true);
    setEditing(false);
  }

  const today = new Date();
  const bday  = birthday ? new Date(birthday.replace(/(\d{2})-(\d{2})/, `${today.getFullYear()}-$1-$2`)) : null;
  const daysUntil = bday ? Math.ceil((bday - today) / (1000 * 60 * 60 * 24)) : null;
  const isSoon = daysUntil !== null && daysUntil >= 0 && daysUntil <= 30;

  return (
    <div className="space-y-4">
      {/* Birthday card */}
      <div className="rounded-2xl p-6 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(212,168,67,0.08) 0%, rgba(139,105,20,0.05) 100%)", border: "1px solid rgba(212,168,67,0.2)" }}>
        <div className="text-5xl mb-3">🎂</div>
        <h3 className="text-base font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "var(--ivory)" }}>
          Birthday Discount
        </h3>
        <p className="text-xs mb-4" style={{ color: "rgba(242,232,217,0.4)" }}>
          Save your birthday and get <span style={{ color: "#D4A843" }}>20% OFF</span> on your special day!
        </p>

        {saved && !editing ? (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.3)" }}>
              <span>🎉</span>
              <span className="text-sm font-bold" style={{ color: "#D4A843" }}>{birthday}</span>
            </div>
            {isSoon && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl px-4 py-3"
                style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.25)" }}>
                <p className="text-xs font-semibold" style={{ color: "#D4A843" }}>
                  🎊 {daysUntil === 0 ? "Happy Birthday! Your 20% discount is active!" : `${daysUntil} days until your birthday!`}
                </p>
              </motion.div>
            )}
            <button onClick={() => setEditing(true)}
              className="text-xs transition"
              style={{ color: "rgba(242,232,217,0.3)" }}
              onMouseEnter={e => e.target.style.color = "rgba(242,232,217,0.6)"}
              onMouseLeave={e => e.target.style.color = "rgba(242,232,217,0.3)"}>
              Change date
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest mb-2 text-left" style={{ color: "rgba(212,168,67,0.5)" }}>
                Your Birthday (DD-MM)
              </p>
              <input type="text" placeholder="e.g. 15-08" value={birthday}
                onChange={e => setBirthday(e.target.value)}
                maxLength={5}
                className="w-full rounded-xl px-4 py-3 text-sm text-center outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(242,232,217,0.9)" }}
                onFocus={e => e.target.style.borderColor = "rgba(212,168,67,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
            <button onClick={saveBirthday} disabled={!birthday || birthday.length < 5}
              className="w-full py-3 rounded-xl text-xs font-bold disabled:opacity-40"
              style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}>
              Save & Claim Birthday Discount 🎁
            </button>
          </div>
        )}
      </div>

      {/* Perks */}
      <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-xs font-bold mb-3" style={{ color: "rgba(242,232,217,0.6)" }}>Birthday Perks</p>
        {[
          { icon: "🎂", text: "20% OFF on your birthday" },
          { icon: "🎁", text: "Free birthday cake slice" },
          { icon: "⭐", text: "2x loyalty points all day" },
          { icon: "💌", text: "Special birthday message on cake" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <span className="text-base">{item.icon}</span>
            <p className="text-xs" style={{ color: "rgba(242,232,217,0.5)" }}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Order Experience Tab ──────────────────────────────────────────────────────
function OrderExperience({ onOrderClick, onClose }) {
  const [couponCopied, setCouponCopied] = useState(false);
  const [trackInput,   setTrackInput]   = useState("");
  const [trackId,      setTrackId]      = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const COMBOS = [
    { emoji: "🎂+🍫", name: "Cake + Brownies", discount: "10% OFF", code: "COMBO15" },
    { emoji: "🎂+☕", name: "Cake + Beverage",  discount: "8% OFF",  code: "COMBO15" },
    { emoji: "🥐+☕", name: "Pastry + Coffee",  discount: "12% OFF", code: "COMBO15" },
    { emoji: "🍫×3",  name: "Brownie Box",      discount: "15% OFF", code: "COMBO15" },
  ];

  const DELIVERY_OPTIONS = [
    { id: "sameday", icon: "⚡", label: "Same Day Delivery",  desc: "Items under ₹600 · Order before 2 PM",    badge: "Fastest", badgeColor: "#4ade80" },
    { id: "schedule",icon: "📅", label: "Schedule Delivery",  desc: "Choose Today / Tomorrow / Custom date",   badge: "Popular", badgeColor: "#D4A843" },
    { id: "pickup",  icon: "🏪", label: "Store Pickup",       desc: "Free · Ready in 2 hours",                badge: "Free",    badgeColor: "#60a5fa" },
  ];

  function copyCode(code) {
    navigator.clipboard.writeText(code).catch(() => {});
    setCouponCopied(code);
    setTimeout(() => setCouponCopied(false), 2000);
  }

  function generateCouponLink(code) {
    const url = `${window.location.origin}?coupon=${code}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCouponCopied(`link_${code}`);
    setTimeout(() => setCouponCopied(false), 2000);
  }

  function handleDeliverySelect(optId) {
    setSelectedDelivery(optId);
  }

  function handleProceed() {
    if (onOrderClick) {
      onClose?.();
      onOrderClick(selectedDelivery);
    }
  }

  return (
    <div className="space-y-5">

      {/* ── Delivery Options — INTERACTIVE ── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2"
          style={{ color: "rgba(212,168,67,0.6)" }}>
          <span>🚚</span> Delivery Options
          <span className="text-[8px]" style={{ color: "rgba(242,232,217,0.3)" }}>— tap to select</span>
        </p>
        <div className="space-y-2">
          {DELIVERY_OPTIONS.map((d) => {
            const isSelected = selectedDelivery === d.id;
            return (
              <motion.button
                key={d.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDeliverySelect(d.id)}
                className="w-full flex items-start gap-3 px-4 py-3.5 rounded-2xl text-left transition-all"
                style={{
                  background: isSelected ? "rgba(212,168,67,0.1)" : "rgba(255,255,255,0.04)",
                  border: isSelected ? "1.5px solid rgba(212,168,67,0.5)" : "1px solid rgba(255,255,255,0.07)",
                }}>
                <span className="text-xl mt-0.5 shrink-0">{d.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-semibold" style={{ color: isSelected ? "#D4A843" : "var(--ivory)" }}>{d.label}</p>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: `${d.badgeColor}18`, color: d.badgeColor, border: `1px solid ${d.badgeColor}30` }}>
                      {d.badge}
                    </span>
                  </div>
                  <p className="text-[10px]" style={{ color: "rgba(242,232,217,0.4)" }}>{d.desc}</p>
                </div>
                <div className="w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center"
                  style={{
                    background: isSelected ? "linear-gradient(135deg,#D4A843,#8B6914)" : "rgba(255,255,255,0.08)",
                    border: isSelected ? "none" : "1px solid rgba(255,255,255,0.15)",
                  }}>
                  {isSelected && (
                    <svg className="w-3 h-3" fill="none" stroke="#0a0800" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                    </svg>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Proceed button — shows when option selected */}
        <AnimatePresence>
          {selectedDelivery && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              onClick={handleProceed}
              className="w-full mt-3 py-3 rounded-2xl text-sm font-bold transition-all"
              style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}>
              Continue with {DELIVERY_OPTIONS.find(d => d.id === selectedDelivery)?.label} →
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }}/>

      {/* ── Combo Offers ── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2"
          style={{ color: "rgba(212,168,67,0.6)" }}>
          <span>🎉</span> Combo Offers
        </p>
        <div className="space-y-2">
          {COMBOS.map((c, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: "var(--ivory)" }}>{c.name}</p>
                <p className="text-[10px]" style={{ color: "rgba(212,168,67,0.6)" }}>{c.discount}</p>
              </div>
              <button onClick={() => copyCode(c.code)}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0 transition"
                style={{
                  background: couponCopied === c.code ? "rgba(34,197,94,0.15)" : "rgba(212,168,67,0.1)",
                  color: couponCopied === c.code ? "#4ade80" : "#D4A843",
                  border: `1px solid ${couponCopied === c.code ? "rgba(34,197,94,0.3)" : "rgba(212,168,67,0.2)"}`,
                }}>
                {couponCopied === c.code ? "✓ Copied" : c.code}
              </button>
            </div>
          ))}
        </div>
        <p className="text-[10px] mt-2 text-center" style={{ color: "rgba(242,232,217,0.25)" }}>
          Add combo items to cart — discount applies automatically
        </p>
      </div>

      <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }}/>

      {/* ── Order Tracking ── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2"
          style={{ color: "rgba(212,168,67,0.6)" }}>
          <span>🔍</span> Track Order
        </p>
        <div className="flex gap-2">
          <input type="text" placeholder="Enter Order ID (e.g. KB1A2B3C)..."
            value={trackInput} onChange={e => setTrackInput(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === "Enter" && trackInput.trim() && setTrackId(trackInput.trim())}
            className="flex-1 rounded-xl px-3 py-2.5 text-xs outline-none"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(242,232,217,0.9)" }}
            onFocus={e => e.target.style.borderColor = "rgba(212,168,67,0.5)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
          <button onClick={() => trackInput.trim() && setTrackId(trackInput.trim())}
            disabled={!trackInput.trim()}
            className="px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}>
            Track
          </button>
        </div>
        {trackId && (
          <div className="mt-3 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(212,168,67,0.06)", border: "1px solid rgba(212,168,67,0.15)" }}>
            <p className="text-xs font-bold mb-1" style={{ color: "#D4A843" }}>Tracking: #{trackId}</p>
            <p className="text-[10px] mb-2" style={{ color: "rgba(242,232,217,0.4)" }}>
              Place an order to get your tracking ID. It will appear in your order confirmation.
            </p>
            <button onClick={() => { onClose?.(); onOrderClick?.(); }}
              className="text-[10px] font-bold px-3 py-1.5 rounded-xl w-full"
              style={{ background: "rgba(212,168,67,0.1)", color: "#D4A843", border: "1px solid rgba(212,168,67,0.2)" }}>
              Go to Order Menu →
            </button>
          </div>
        )}
      </div>

      <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }}/>

      {/* ── Share Coupon Link ── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2"
          style={{ color: "rgba(212,168,67,0.6)" }}>
          <span>🔗</span> Share Discount Links
        </p>
        <p className="text-xs mb-3" style={{ color: "rgba(242,232,217,0.35)" }}>
          Share a link — coupon auto-applies when friend clicks!
        </p>
        <div className="grid grid-cols-2 gap-2">
          {["FIRST50", "SWEET80", "BAKE125", "ROYAL200"].map(code => (
            <button key={code} onClick={() => generateCouponLink(code)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl transition"
              style={{
                background: couponCopied === `link_${code}` ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${couponCopied === `link_${code}` ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.07)"}`,
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,168,67,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = couponCopied === `link_${code}` ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.07)"}>
              <span className="text-xs font-bold" style={{ color: couponCopied === `link_${code}` ? "#4ade80" : "#D4A843" }}>{code}</span>
              <span className="text-[10px]" style={{ color: "rgba(242,232,217,0.3)" }}>
                {couponCopied === `link_${code}` ? "✓ Copied!" : "🔗 Copy"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Drawer ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "orders",    icon: "📦", label: "Orders"    },
  { id: "experience",icon: "🚀", label: "Order Info" },
  { id: "addresses", icon: "📍", label: "Addresses" },
  { id: "points",    icon: "⭐", label: "Points"    },
  { id: "birthday",  icon: "🎂", label: "Birthday"  },
];

export default function UserAccountDrawer({ isOpen, onClose, user, onLoginClick, onOrderClick }) {
  const [activeTab, setActiveTab] = useState("orders");

  // close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[150]"
            style={{ background: "rgba(8,6,4,0.7)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[160] flex flex-col"
            style={{
              width: "min(420px, 100vw)",
              background: "linear-gradient(160deg, #1a1508 0%, #0f0d08 100%)",
              borderLeft: "1px solid rgba(212,168,67,0.15)",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div className="shrink-0 px-6 pt-6 pb-4"
              style={{ borderBottom: "1px solid rgba(212,168,67,0.1)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {user ? (
                    <>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}>
                        {(user.user_metadata?.full_name || user.email || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: "var(--ivory)" }}>
                          {user.user_metadata?.full_name || user.email?.split("@")[0]}
                        </p>
                        <p className="text-[10px]" style={{ color: "rgba(212,168,67,0.5)" }}>
                          {user.email}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="text-sm font-bold" style={{ color: "var(--ivory)" }}>My Account</p>
                      <button onClick={() => { onClose(); onLoginClick(); }}
                        className="text-[10px] font-semibold mt-0.5"
                        style={{ color: "#D4A843" }}>
                        Login / Register →
                      </button>
                    </div>
                  )}
                </div>
                <button onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(242,232,217,0.4)" }}
                  onMouseEnter={e => e.currentTarget.style.color = "rgba(242,232,217,0.8)"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(242,232,217,0.4)"}>
                  ✕
                </button>
              </div>

              {/* Tab bar */}
              <div className="flex gap-1 p-1 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)" }}>
                {TABS.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all"
                    style={activeTab === tab.id
                      ? { background: "linear-gradient(135deg,rgba(212,168,67,0.2),rgba(139,105,20,0.15))", border: "1px solid rgba(212,168,67,0.3)" }
                      : { border: "1px solid transparent" }
                    }>
                    <span className="text-base">{tab.icon}</span>
                    <span className="text-[9px] font-semibold uppercase tracking-wide"
                      style={{ color: activeTab === tab.id ? "#D4A843" : "rgba(242,232,217,0.35)" }}>
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}>
                  {activeTab === "orders"     && <OrderHistory user={user} />}
                  {activeTab === "experience" && <OrderExperience onOrderClick={onOrderClick} onClose={onClose} />}
                  {activeTab === "addresses"  && <SavedAddresses />}
                  {activeTab === "points"     && <LoyaltyPoints user={user} />}
                  {activeTab === "birthday"   && <BirthdayReminder user={user} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 py-4"
              style={{ borderTop: "1px solid rgba(212,168,67,0.08)" }}>
              <p className="text-[10px] text-center" style={{ color: "rgba(242,232,217,0.2)" }}>
                Krishna Bakers · Premium Member Area
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
