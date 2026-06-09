import { useState, useEffect, useRef } from "react";
import { saveOrder } from "../services/orderService";
import { useLocation, TRANSLATIONS } from "../context/LocationContext";
import { AnimatePresence, motion } from "framer-motion";
import OrderTracking from "./OrderTracking";
import { applyReferralOnOrder } from "./ReferralSystem";
import PaymentModal from "./PaymentModal";

// ─── Flash Sale Items (id → end time) ────────────────────────────────────────
const FLASH_SALES = {
  1:  { label: "Flash Deal",  endTime: Date.now() + 2 * 60 * 60 * 1000 }, // 2 hrs
  9:  { label: "Flash Deal",  endTime: Date.now() + 1 * 60 * 60 * 1000 }, // 1 hr
  12: { label: "Happy Hour",  endTime: Date.now() + 3 * 60 * 60 * 1000 }, // 3 hrs
};

// ─── Frequently Bought Together ───────────────────────────────────────────────
const FREQUENTLY_TOGETHER = {
  1:  [9, 12],   // Classic Cake → Brownie + Hot Choc
  2:  [6, 12],   // Cheesecake → Croissant + Hot Choc
  9:  [1, 10],   // Brownie → Cake + Walnut Brownie
  12: [6, 9],    // Hot Choc → Croissant + Brownie
  6:  [7, 12],   // Croissant → Pain au Choc + Hot Choc
  3:  [9, 12],   // Choc Truffle → Brownie + Hot Choc
};

// ─── Combo Offers ─────────────────────────────────────────────────────────────
const COMBO_OFFERS = [
  { id: "c1", name: "Cake + Brownies Combo", items: [1, 9],      discount: 10, label: "🎂+🍫 10% OFF" },
  { id: "c2", name: "Cake + Beverage Combo", items: [1, 12],     discount: 8,  label: "🎂+☕ 8% OFF"  },
  { id: "c3", name: "Pastry + Coffee Combo", items: [6, 12],     discount: 12, label: "🥐+☕ 12% OFF" },
  { id: "c4", name: "Brownie Box Combo",     items: [9, 10, 11], discount: 15, label: "🍫×3 15% OFF" },
];

// ─── Flash Sale Countdown ─────────────────────────────────────────────────────
function FlashTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, endTime - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(Math.max(0, endTime - Date.now())), 1000);
    return () => clearInterval(t);
  }, [endTime]);
  const h = Math.floor(timeLeft / 3600000);
  const m = Math.floor((timeLeft % 3600000) / 60000);
  const s = Math.floor((timeLeft % 60000) / 1000);
  if (timeLeft === 0) return null;
  return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1"
      style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
      ⏱ {h > 0 ? `${h}h ` : ""}{String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}
    </span>
  );
}

// ─── Menu Data with images ────────────────────────────────────────────────────
const menuData = [
  {
    category: "Featured Items",
    icon: "⭐",
    items: [
      { id: 1,  name: "Classic English Cake",          price: 450,  veg: true, tag: "Bestseller", rating: 4.8, reviews: 124, desc: "Light sponge, no frosting, baked fresh daily. A timeless classic.", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80", customizable: true },
      { id: 2,  name: "Velvet Cheesecake",             price: 380,  veg: true, tag: "Bestseller", rating: 4.9, reviews: 98,  desc: "New York style baked cheesecake, rich and creamy.", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=80", customizable: false },
      { id: 16, name: "Chocolate Rouge Reverie",       price: 1499, veg: true, tag: "Luxe",       rating: 4.9, reviews: 43,  desc: "Eggless dark chocolate mousse with ruby red berry glaze. A showstopper.", image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=400&q=80", customizable: true },
      { id: 20, name: "Cocoa Hazelnut Mousse",         price: 2499, veg: true, tag: "Luxe",       rating: 4.9, reviews: 22,  desc: "Eggless cocoa hazelnut mousse cake with praline crunch. Premium gifting choice.", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80", customizable: true },
    ],
  },
  {
    category: "Cakes",
    icon: "🎂",
    items: [
      { id: 3,  name: "Chocolate Truffle Cake",       price: 520,  veg: true, tag: "",           rating: 4.7, reviews: 76,  desc: "Dark chocolate ganache layered cake. Intensely rich.", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80", customizable: true },
      { id: 4,  name: "Mango Mousse Cake",            price: 490,  veg: true, tag: "Seasonal",   rating: 4.6, reviews: 54,  desc: "Fresh mango pulp with light mousse layers. Summer special.", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80", customizable: true },
      { id: 5,  name: "Butterscotch Cake",            price: 420,  veg: true, tag: "",           rating: 4.5, reviews: 61,  desc: "Classic butterscotch with caramel drizzle.", image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=400&q=80", customizable: true },
      { id: 16, name: "Chocolate Rouge Reverie",      price: 1499, veg: true, tag: "Luxe",       rating: 4.9, reviews: 43,  desc: "Eggless dark chocolate mousse with ruby red berry glaze. A showstopper.", image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=400&q=80", customizable: true },
      { id: 17, name: "Midnight Blueberry Cheesecake",price: 1199, veg: true, tag: "Luxe",       rating: 4.8, reviews: 38,  desc: "Velvety cheesecake topped with fresh blueberry compote on a buttery crust.", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=80", customizable: false },
      { id: 18, name: "Luxe Mango Cheese Cake",       price: 1399, veg: true, tag: "Luxe",       rating: 4.8, reviews: 51,  desc: "Creamy mango cheesecake with fresh alphonso mango topping. Pure summer luxury.", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80", customizable: true },
      { id: 19, name: "Fresh Mango Cream Cake",       price: 1499, veg: true, tag: "Luxe",       rating: 4.7, reviews: 29,  desc: "Soft sponge layered with fresh mango cream and topped with mango glaze.", image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=400&q=80", customizable: true },
      { id: 20, name: "Cocoa Hazelnut Mousse",        price: 2499, veg: true, tag: "Luxe",       rating: 4.9, reviews: 22,  desc: "Eggless cocoa hazelnut mousse cake with praline crunch. Premium gifting choice.", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80", customizable: true },
    ],
  },
  {
    category: "Pastries",
    icon: "🥐",
    items: [
      { id: 6,  name: "Croissant",              price: 120, veg: true, tag: "",           rating: 4.7, reviews: 210, desc: "Flaky, buttery, baked fresh every morning.", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80", customizable: false },
      { id: 7,  name: "Pain au Chocolat",       price: 150, veg: true, tag: "",           rating: 4.8, reviews: 143, desc: "Croissant dough wrapped around dark chocolate.", image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=400&q=80", customizable: false },
      { id: 8,  name: "Almond Danish",          price: 160, veg: true, tag: "",           rating: 4.6, reviews: 89,  desc: "Puff pastry with almond cream filling.", image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=400&q=80", customizable: false },
    ],
  },
  {
    category: "Brownies",
    icon: "🍫",
    items: [
      { id: 9,  name: "Classic Fudge Brownie",  price: 90,  veg: true, tag: "Bestseller", rating: 4.9, reviews: 312, desc: "Dense, fudgy, with a crinkle top. Our most loved item.", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80", customizable: false },
      { id: 10, name: "Walnut Brownie",         price: 100, veg: true, tag: "",           rating: 4.7, reviews: 178, desc: "Fudge brownie loaded with crunchy walnuts.", image: "https://images.unsplash.com/photo-1589375462-390b7e0b5e5e?auto=format&fit=crop&w=400&q=80", customizable: false },
      { id: 11, name: "Cream Cheese Brownie",   price: 110, veg: true, tag: "",           rating: 4.6, reviews: 95,  desc: "Swirled cream cheese on fudge base.", image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=400&q=80", customizable: false },
    ],
  },
  {
    category: "Beverages",
    icon: "☕",
    items: [
      { id: 12, name: "Hot Chocolate",          price: 195, veg: true, tag: "Bestseller", rating: 4.8, reviews: 267, desc: "Rich Belgian chocolate, 250ml. Velvety smooth.", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=400&q=80", customizable: false },
      { id: 13, name: "Cold Coffee",            price: 180, veg: true, tag: "",           rating: 4.6, reviews: 134, desc: "Chilled espresso with milk and ice.", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80", customizable: false },
      { id: 14, name: "Masala Chai",            price: 80,  veg: true, tag: "",           rating: 4.7, reviews: 189, desc: "Spiced Indian tea, freshly brewed.", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80", customizable: false },
    ],
  },
];

// ─── Star rating component ────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  );
}

// ─── Promo Codes ─────────────────────────────────────────────────────────────
const PROMOS = [
  { code: "COMBO15",  desc: "Flat 15% OFF on all combos",   minOrder: null },
  { code: "FIRST50",  desc: "₹50 OFF on your first order",  minOrder: 500  },
  { code: "SWEET80",  desc: "₹80 OFF above ₹800",           minOrder: 800  },
  { code: "BAKE125",  desc: "₹125 OFF above ₹1000",         minOrder: 1000 },
  { code: "ROYAL200", desc: "₹200 OFF above ₹1500",         minOrder: 1500 },
];

// ─── Main Component ───────────────────────────────────────────────────────────
function OrderMenu({ orderInfo, onClose, highlightProductId }) {
  const { lang } = useLocation();
  const t = TRANSLATIONS[lang] || TRANSLATIONS["en"];
  const [cart, setCart] = useState({});
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [quickView, setQuickView] = useState(null);
  const [showPromos, setShowPromos] = useState(false);
  const [copiedCode, setCopiedCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [offerIdx, setOfferIdx] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  // New features
  const [deliveryDate, setDeliveryDate] = useState("today");
  const [customDate, setCustomDate] = useState("");
  const [appliedCombo, setAppliedCombo] = useState(null);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [showTracking, setShowTracking] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [showAbandonedCart, setShowAbandonedCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const itemRefs = useRef({});
  const mainRef = useRef(null);

  // ── URL coupon auto-apply ──────────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCoupon = params.get("coupon") || params.get("promo") || params.get("code");
    if (urlCoupon) {
      const found = PROMOS.find(p => p.code.toLowerCase() === urlCoupon.toLowerCase());
      if (found && !appliedPromo) {
        setAppliedPromo(found);
      }
    }
  }, []);

  // ── Auto-detect combo ──────────────────────────────────────────────────────
  useEffect(() => {
    const cartIds = Object.keys(cart).map(Number);
    const matched = COMBO_OFFERS.find(combo =>
      combo.items.every(id => cartIds.includes(id))
    );
    setAppliedCombo(matched || null);
  }, [cart]);
  useEffect(() => {
    const t = setInterval(() => setOfferIdx((i) => (i + 1) % PROMOS.length), 3000);
    return () => clearInterval(t);
  }, []);

  function copyCode(code) {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  }

  // highlight + auto-add from chat
  useEffect(() => {
    if (!highlightProductId) return;
    setCart((prev) => ({ ...prev, [highlightProductId]: (prev[highlightProductId] || 0) + 1 }));
    setTimeout(() => {
      itemRefs.current[highlightProductId]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
  }, [highlightProductId]);

  function addItem(id) { setCart((p) => ({ ...p, [id]: (p[id] || 0) + 1 })); }
  function removeItem(id) {
    setCart((p) => {
      const u = { ...p };
      if (u[id] > 1) u[id]--; else delete u[id];
      return u;
    });
  }

  const allItems = menuData.flatMap((c) => c.items);
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = allItems.find((i) => i.id === Number(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const filters = ["All", ...menuData.map((c) => c.category)];

  // search karte waqt "Featured Items" skip karo duplicate avoid karne ke liye
  const filteredMenu = menuData
    .filter((cat) => {
      if (activeFilter === "All") return cat.category !== "Featured Items" || !search;
      return cat.category === activeFilter;
    })
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF9F6] flex flex-col overflow-hidden w-full max-w-full">

      {/* ── Top Bar ── */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-3 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-900 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">KB</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-base">Krishna Bakers</span>
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold tracking-wide">{t.menuOpen}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <span>{orderInfo.orderType === "delivery" ? "🚚 Delivery" : "🏪 Pickup"}</span>
              <span className="text-gray-300">·</span>
              <span className="truncate max-w-[200px]">📍 {orderInfo.address}</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (totalItems > 0) {
              setShowAbandonedCart(true);
            } else {
              onClose();
            }
          }}
          className="text-gray-400 hover:text-gray-700 border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition text-lg leading-none">✕</button>
      </div>

      {/* ── Offer Banner (rotating) ── */}
      <div
        className="bg-gradient-to-r from-amber-600 to-amber-800 px-4 md:px-8 py-2 flex items-center justify-between cursor-pointer shrink-0"
        onClick={() => setShowPromos(true)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-base shrink-0">🏷️</span>
          <p className="text-white text-xs font-medium truncate">
            <span className="font-bold">{PROMOS[offerIdx].code}</span>
            {" · "}{PROMOS[offerIdx].desc}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className="text-amber-200 text-xs font-semibold whitespace-nowrap">
            {PROMOS.length} OFFERS ›
          </span>
        </div>
      </div>

      {/* ── Search + Filter Bar ── */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-3 shrink-0">
        {/* search */}
        <div className="relative mb-3">
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder={t.menuSearch}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // search karte waqt category filter hata do taaki sab categories mein dhundhe
              if (e.target.value) setActiveFilter("All");
            }}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-400 transition bg-gray-50"
          />
          {search && (
            <button onClick={() => { setSearch(""); setActiveFilter("All"); }} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">✕</button>
          )}
        </div>
        {/* category filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((f) => {
            const cat = menuData.find((c) => c.category === f);
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  activeFilter === f
                    ? "bg-amber-900 text-white border-amber-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-amber-400"
                }`}
              >
                {cat ? cat.icon : "🍴"} {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div ref={mainRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        {filteredMenu.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-sm">No items found for "<strong>{search}</strong>"</p>
          </div>
        ) : (
          filteredMenu.map((cat) => (
            <div key={cat.category} className="mb-12">
              {/* category heading */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">{cat.icon}</span>
                <h3 className="text-base font-bold text-gray-800 uppercase tracking-widest">{cat.category}</h3>
                <div className="flex-1 h-px bg-gray-100 ml-2" />
                <span className="text-xs text-gray-400">{cat.items.length} {t.menuItems}</span>
              </div>

              {/* items grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {cat.items.map((item) => {
                  const isHighlighted = item.id === highlightProductId;
                  const qty = cart[item.id] || 0;
                  // Same day delivery badge — items under ₹600 are same-day eligible
                  const isSameDay  = item.price <= 600;
                  const flashSale  = FLASH_SALES[item.id];
                  return (
                    <div
                      key={item.id}
                      ref={(el) => { itemRefs.current[item.id] = el; }}
                      className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 group ${
                        isHighlighted
                          ? "border-amber-400 ring-2 ring-amber-300 ring-offset-2 shadow-lg"
                          : "border-gray-100 hover:shadow-md hover:border-gray-200"
                      }`}
                    >
                      {/* image */}
                      <div className="relative h-44 overflow-hidden bg-amber-50 cursor-pointer" onClick={() => setQuickView(item)}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                        {/* overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                            {t.menuQuickView}
                          </span>
                        </div>
                        {/* badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {item.tag && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.tag === "Bestseller" ? "bg-amber-500 text-white" :
                              item.tag === "Seasonal"   ? "bg-green-500 text-white" :
                              "bg-blue-500 text-white"
                            }`}>{item.tag}</span>
                          )}
                          {isHighlighted && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500 text-white animate-pulse">{t.menuFromChat}</span>
                          )}
                          {isSameDay && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1">
                              ⚡ Same Day
                            </span>
                          )}
                          {flashSale && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white flex items-center gap-1">
                              🔥 {flashSale.label}
                            </span>
                          )}
                        </div>
                        {/* flash timer on image */}
                        {flashSale && (
                          <div className="absolute bottom-2 right-2">
                            <FlashTimer endTime={flashSale.endTime} />
                          </div>
                        )}
                        {/* veg dot */}
                        <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-sm border border-gray-200 flex items-center justify-center shadow-sm">
                          <span className={`w-2.5 h-2.5 rounded-full ${item.veg ? "bg-green-500" : "bg-red-500"}`} />
                        </div>
                        {/* customizable badge */}
                        {item.customizable && (
                          <div className="absolute bottom-2 left-2 bg-white/90 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            ✏️ {t.menuCustomizable}
                          </div>
                        )}
                      </div>

                      {/* info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h4>
                        </div>
                        {/* rating */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <Stars rating={item.rating} />
                          <span className="text-xs font-semibold text-amber-700">{item.rating}</span>
                          <span className="text-xs text-gray-400">({item.reviews})</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">{item.desc}</p>

                        {/* price + add button */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-base font-bold text-gray-900">₹{item.price}</span>
                            <span className="text-xs text-gray-400 ml-1">{t.menuPiece}</span>
                          </div>
                          {qty > 0 ? (
                            <div className="flex items-center gap-1 bg-amber-900 rounded-xl overflow-hidden">
                              <button onClick={() => removeItem(item.id)} className="px-3 py-2 text-white hover:bg-amber-800 text-base font-bold transition">−</button>
                              <span className="text-sm font-bold text-white w-5 text-center">{qty}</span>
                              <button onClick={() => addItem(item.id)} className="px-3 py-2 text-white hover:bg-amber-800 text-base font-bold transition">+</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addItem(item.id)}
                              className="bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1"
                            >
                              <span>{t.menuAdd}</span>
                              <span className="text-base leading-none">+</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* bottom padding for cart bar */}
        <div className="h-6" />

        {/* ── Frequently Bought Together ── */}
        {Object.keys(cart).length > 0 && (() => {
          const cartIds = Object.keys(cart).map(Number);
          const suggestions = new Set();
          cartIds.forEach(id => {
            (FREQUENTLY_TOGETHER[id] || []).forEach(sid => {
              if (!cartIds.includes(sid)) suggestions.add(sid);
            });
          });
          const suggestedItems = allItems.filter(i => suggestions.has(i.id)).slice(0, 3);
          if (suggestedItems.length === 0) return null;
          return (
            <div className="px-4 md:px-8 pb-6">
              <div className="rounded-2xl overflow-hidden border border-amber-100 bg-amber-50">
                <div className="px-4 py-3 flex items-center gap-2 border-b border-amber-100">
                  <span className="text-base">🛍️</span>
                  <p className="text-xs font-bold text-amber-900">Frequently Bought Together</p>
                </div>
                <div className="flex gap-3 p-3 overflow-x-auto scrollbar-hide">
                  {suggestedItems.map(item => (
                    <div key={item.id} className="flex-shrink-0 w-36 bg-white rounded-xl overflow-hidden border border-amber-100 shadow-sm">
                      <div className="h-24 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                      </div>
                      <div className="p-2">
                        <p className="text-[11px] font-semibold text-gray-800 truncate">{item.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-bold text-amber-800">₹{item.price}</span>
                          <button onClick={() => addItem(item.id)}
                            className="text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-900 text-white hover:bg-amber-800 transition">
                            + Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── Cart Bar ── */}
      {totalItems > 0 && (
        <div className="bg-white border-t border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.06)] shrink-0">
          <div>
            <p className="text-sm font-bold text-gray-900">{totalItems} {totalItems > 1 ? t.menuItemsAdded : t.menuItemAdded}</p>
            <p className="text-xs text-gray-400">{t.menuTotal} ₹{totalPrice}</p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="bg-amber-900 hover:bg-amber-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            {t.menuViewCart}
          </button>
        </div>
      )}

      {/* ── Promos Modal ── */}
      {showPromos && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4" onClick={() => setShowPromos(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏷️</span>
                <h3 className="text-base font-bold text-gray-900">{t.menuOffersPromos}</h3>
              </div>
              <button onClick={() => setShowPromos(false)} className="text-gray-400 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-xl">&times;</button>
            </div>

            {/* promo list */}
            <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
              {PROMOS.map((promo) => {
                const isApplied = appliedPromo?.code === promo.code;
                const isCopied  = copiedCode === promo.code;
                return (
                  <div key={promo.code} className={`px-6 py-4 transition ${isApplied ? "bg-green-50" : "hover:bg-gray-50"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        {/* code pill */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-amber-700 bg-amber-50 border border-dashed border-amber-300 px-2.5 py-0.5 rounded-lg tracking-wider">
                            {promo.code}
                          </span>
                          {isApplied && (
                            <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-semibold">{t.menuApplied}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 font-medium">{promo.desc}</p>
                        {promo.minOrder && (
                          <p className="text-xs text-gray-400 mt-0.5">{t.menuMinOrder} ₹{promo.minOrder}</p>
                        )}
                      </div>
                      {/* copy button */}
                      <button
                        onClick={() => copyCode(promo.code)}
                        className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                          isCopied
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-white text-amber-800 border-amber-300 hover:bg-amber-50"
                        }`}
                      >
                        {isCopied ? t.menuCopied : t.menuCopy}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">{t.menuTapCopy}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Quick View Modal ── */}
      {quickView && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 px-4" onClick={() => setQuickView(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-52 bg-amber-50">
              <img src={quickView.image} alt={quickView.name} className="w-full h-full object-cover" />
              <button onClick={() => setQuickView(null)} className="absolute top-3 right-3 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 shadow">✕</button>
              {quickView.tag && (
                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  quickView.tag === "Bestseller" ? "bg-amber-500 text-white" :
                  quickView.tag === "Seasonal"   ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                }`}>{quickView.tag}</span>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{quickView.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <Stars rating={quickView.rating} />
                <span className="text-xs font-semibold text-amber-700">{quickView.rating}</span>
                <span className="text-xs text-gray-400">· {quickView.reviews} {t.menuReviews}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{quickView.desc}</p>
              {quickView.customizable && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-4 text-xs text-amber-800 flex items-center gap-2">
                  ✏️ <span>{t.menuCustomNote}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">₹{quickView.price}</span>
                {(cart[quickView.id] || 0) > 0 ? (
                  <div className="flex items-center gap-1 bg-amber-900 rounded-xl overflow-hidden">
                    <button onClick={() => removeItem(quickView.id)} className="px-3 py-2 text-white hover:bg-amber-800 font-bold">−</button>
                    <span className="text-sm font-bold text-white w-5 text-center">{cart[quickView.id]}</span>
                    <button onClick={() => addItem(quickView.id)} className="px-3 py-2 text-white hover:bg-amber-800 font-bold">+</button>
                  </div>
                ) : (
                  <button
                    onClick={() => { addItem(quickView.id); setQuickView(null); }}
                    className="bg-amber-900 hover:bg-amber-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition"
                  >
                    {t.menuAddToCart}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Cart Summary Modal ── */}
      {showCart && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">{t.menuYourOrder}</h3>
                <p className="text-xs text-gray-400">{totalItems} {totalItems > 1 ? t.menuItemsAdded : t.menuItemAdded} · {orderInfo.orderType === "delivery" ? t.chatDelivery : t.chatPickup}</p>
              </div>
              <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-700 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">&times;</button>
            </div>

            {/* items */}
            <div className="divide-y divide-gray-50 max-h-48 overflow-y-auto">
              {Object.entries(cart).map(([id, qty]) => {
                const item = allItems.find((i) => i.id === Number(id));
                if (!item) return null;
                return (
                  <div key={id} className="flex items-center gap-3 px-6 py-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-amber-50 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">₹{item.price} × {qty} = <span className="font-semibold text-gray-600">₹{item.price * qty}</span></p>
                    </div>
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden shrink-0">
                      <button onClick={() => removeItem(Number(id))} className="px-2.5 py-1 text-gray-500 hover:bg-red-50 hover:text-red-500 transition text-sm font-bold">−</button>
                      <span className="text-sm font-bold text-gray-800 w-4 text-center">{qty}</span>
                      <button onClick={() => addItem(Number(id))} className="px-2.5 py-1 text-gray-500 hover:bg-green-50 hover:text-green-600 transition text-sm font-bold">+</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Combo offer banner ── */}
            {appliedCombo && (
              <div className="mx-4 mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-base">🎉</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-amber-800">{appliedCombo.label} Applied!</p>
                  <p className="text-[10px] text-amber-600">{appliedCombo.name} — {appliedCombo.discount}% off</p>
                </div>
                <span className="text-xs font-bold text-green-600">−₹{Math.round(totalPrice * appliedCombo.discount / 100)}</span>
              </div>
            )}

            {/* ── Delivery date picker ── */}
            {orderInfo.orderType === "delivery" && (
              <div className="px-6 pt-4 pb-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">📅 Delivery Date</p>
                <div className="flex gap-2">
                  {["today", "tomorrow", "custom"].map(opt => (
                    <button key={opt}
                      onClick={() => setDeliveryDate(opt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${
                        deliveryDate === opt
                          ? "bg-amber-900 text-white border-amber-900"
                          : "bg-white text-gray-600 border-gray-200 hover:border-amber-400"
                      }`}>
                      {opt === "today" ? "⚡ Today" : opt === "tomorrow" ? "📅 Tomorrow" : "🗓 Custom"}
                    </button>
                  ))}
                </div>
                {deliveryDate === "custom" && (
                  <input type="date"
                    value={customDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={e => setCustomDate(e.target.value)}
                    className="w-full mt-2 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400 transition"
                  />
                )}
              </div>
            )}

            {/* bill summary */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              {/* promo apply row */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder={t.menuEnterPromo}
                  value={appliedPromo ? appliedPromo.code : ""}
                  readOnly={!!appliedPromo}
                  onChange={() => {}}
                  className="flex-1 border border-dashed border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-amber-800 uppercase tracking-wider outline-none bg-white placeholder:text-gray-400 placeholder:font-normal placeholder:normal-case placeholder:tracking-normal"
                />
                {appliedPromo ? (
                  <button onClick={() => setAppliedPromo(null)}
                    className="text-xs font-bold px-3 py-2 rounded-xl bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition">
                    {t.menuRemove}
                  </button>
                ) : (
                  <button onClick={() => setShowPromos(true)}
                    className="text-xs font-bold px-3 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition whitespace-nowrap">
                    {t.menuOffers}
                  </button>
                )}
              </div>
              {appliedPromo && (
                <div className="flex items-center gap-1.5 mb-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                  <span>✅</span>
                  <span><strong>{appliedPromo.code}</strong> applied — {appliedPromo.desc}</span>
                </div>
              )}

              {/* Bill rows */}
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{t.menuItemTotal}</span><span>₹{totalPrice}</span>
              </div>
              {appliedCombo && (
                <div className="flex justify-between text-xs text-green-600 mb-1">
                  <span>🎉 Combo Discount ({appliedCombo.discount}%)</span>
                  <span>−₹{Math.round(totalPrice * appliedCombo.discount / 100)}</span>
                </div>
              )}
              {orderInfo.orderType === "delivery" && (
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{t.menuDeliveryFee}</span><span className="text-green-600 font-medium">{t.menuFree}</span>
                </div>
              )}
              {(() => {
                const promoDiscount = appliedPromo
                  ? (appliedPromo.code === "COMBO15"
                      ? Math.round(totalPrice * 0.15)
                      : appliedPromo.minOrder && totalPrice >= appliedPromo.minOrder
                        ? parseInt(appliedPromo.desc.match(/₹(\d+)/)?.[1] || 0)
                        : 0)
                  : 0;
                const comboDiscount = appliedCombo ? Math.round(totalPrice * appliedCombo.discount / 100) : 0;
                const finalTotal = totalPrice - promoDiscount - comboDiscount;
                return (
                  <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                    <span>Total</span><span>₹{finalTotal}</span>
                  </div>
                );
              })()}
            </div>

            {/* Order notes */}
            <div className="px-6 pb-3">
              <textarea
                placeholder="✏️ Special instructions (optional)..."
                value={orderNotes}
                onChange={e => setOrderNotes(e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 transition resize-none text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* address */}
            <div className="px-6 pb-2 flex items-center gap-2 text-xs text-gray-500">
              <span>📍</span>
              <span className="truncate">{orderInfo.address}</span>
            </div>

            {/* place order */}
            <div className="px-6 pb-6 pt-1">
              {orderPlaced ? (
                <div className="w-full bg-green-50 border border-green-200 rounded-xl py-4 text-center">
                  <p className="text-green-700 font-bold text-sm">{t.menuOrderSuccess}</p>
                  <p className="text-green-600 text-xs mt-1">{t.menuOrderThanks}, <strong>{orderInfo.customerName}</strong>! {t.menuWillContact} <strong>{orderInfo.contact}</strong> {t.menuShortly}</p>
                  {placedOrderId && (
                    <button
                      onClick={() => { setShowCart(false); setShowTracking(true); }}
                      className="mt-3 text-xs font-bold px-4 py-2 rounded-xl bg-amber-900 text-white hover:bg-amber-800 transition">
                      🔍 Track My Order
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={async () => {
                    setOrderLoading(true);
                    const promoDiscount = appliedPromo
                      ? (appliedPromo.code === "COMBO15"
                          ? Math.round(totalPrice * 0.15)
                          : appliedPromo.minOrder && totalPrice >= appliedPromo.minOrder
                            ? parseInt(appliedPromo.desc.match(/₹(\d+)/)?.[1] || 0)
                            : 0)
                      : 0;
                    const comboDiscount = appliedCombo ? Math.round(totalPrice * appliedCombo.discount / 100) : 0;
                    const finalTotal = totalPrice - promoDiscount - comboDiscount;
                    const deliveryDateStr = deliveryDate === "today" ? "Today"
                      : deliveryDate === "tomorrow" ? "Tomorrow"
                      : customDate || "";
                    const items = Object.entries(cart).map(([id, qty]) => {
                      const item = allItems.find((i) => i.id === Number(id));
                      return { id: Number(id), name: item?.name, price: item?.price, qty };
                    });
                    const saved = await saveOrder({
                      customerName:  orderInfo.customerName || "Guest",
                      contact:       orderInfo.contact || orderInfo.address,
                      email:         orderInfo.email || "",
                      orderType:     orderInfo.orderType,
                      address:       orderInfo.address,
                      items,
                      subtotal:      totalPrice,
                      discount:      promoDiscount,
                      comboDiscount,
                      total:         finalTotal,
                      promoCode:     appliedPromo?.code || "",
                      deliveryDate:  deliveryDateStr,
                      notes:         orderNotes,
                    });
                    if (saved?.id) setPlacedOrderId(saved.id);
                    // apply referral credit if came via referral link
                    applyReferralOnOrder(orderInfo.contact || orderInfo.address);                    setOrderLoading(false);
                    setOrderPlaced(true);
                    setShowCart(false);
                  }}
                  disabled={orderLoading}
                  className="w-full bg-amber-900 hover:bg-amber-800 text-white py-3.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {orderLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      {t.menuPlacing}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                      Pay ₹{totalPrice - (appliedCombo ? Math.round(totalPrice * appliedCombo.discount / 100) : 0)} →
                    </>
                  )}
                </button>
              )}
              <p className="text-center text-xs text-gray-400 mt-2">{t.menuConfirmSoon}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Abandoned Cart Popup ── */}
      <AnimatePresence>
        {showAbandonedCart && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70]"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
              onClick={() => setShowAbandonedCart(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[71] flex items-center justify-center px-4"
            >
              <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
                {/* top */}
                <div className="bg-gradient-to-r from-amber-800 to-amber-600 px-6 py-5 text-center">
                  <div className="text-4xl mb-2">🛒</div>
                  <h3 className="text-white font-bold text-base">Wait! Your cart is not empty</h3>
                  <p className="text-amber-200 text-xs mt-1">You have {totalItems} item{totalItems > 1 ? "s" : ""} worth ₹{totalPrice}</p>
                </div>
                <div className="p-6 space-y-3">
                  {/* items preview */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {Object.entries(cart).slice(0, 4).map(([id, qty]) => {
                      const item = allItems.find(i => i.id === Number(id));
                      if (!item) return null;
                      return (
                        <div key={id} className="shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-amber-100 relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                          {qty > 1 && (
                            <span className="absolute bottom-0 right-0 bg-amber-900 text-white text-[9px] font-bold px-1 rounded-tl-lg">×{qty}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 text-center">Don't let your treats go to waste! 🎂</p>
                  <button
                    onClick={() => setShowAbandonedCart(false)}
                    className="w-full py-3 rounded-xl text-sm font-bold bg-amber-900 hover:bg-amber-800 text-white transition">
                    Continue Shopping →
                  </button>
                  <button
                    onClick={() => { setShowAbandonedCart(false); setShowCart(true); }}
                    className="w-full py-3 rounded-xl text-sm font-bold border border-amber-200 text-amber-800 hover:bg-amber-50 transition">
                    🛒 View Cart & Checkout
                  </button>
                  <button
                    onClick={() => { setShowAbandonedCart(false); onClose(); }}
                    className="w-full text-xs text-gray-400 hover:text-gray-600 transition py-1">
                    Leave anyway
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Order Tracking Modal ── */}
      <AnimatePresence>
        {showTracking && placedOrderId && (
          <OrderTracking
            orderId={placedOrderId}
            onClose={() => setShowTracking(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Payment Modal ── */}
      <AnimatePresence>
        {showPayment && (
          <PaymentModal
            isOpen={showPayment}
            onClose={() => { setShowPayment(false); setShowCart(true); }}
            amount={(() => {
              const promoDiscount = appliedPromo
                ? (appliedPromo.code === "COMBO15" ? Math.round(totalPrice * 0.15)
                  : appliedPromo.minOrder && totalPrice >= appliedPromo.minOrder
                    ? parseInt(appliedPromo.desc.match(/₹(\d+)/)?.[1] || 0) : 0)
                : 0;
              const comboDiscount = appliedCombo ? Math.round(totalPrice * appliedCombo.discount / 100) : 0;
              return totalPrice - promoDiscount - comboDiscount;
            })()}
            orderId={placedOrderId || Date.now().toString()}
            orderInfo={orderInfo}
            onPaymentDone={async (txnId) => {
              setOrderLoading(true);
              const promoDiscount = appliedPromo
                ? (appliedPromo.code === "COMBO15" ? Math.round(totalPrice * 0.15)
                  : appliedPromo.minOrder && totalPrice >= appliedPromo.minOrder
                    ? parseInt(appliedPromo.desc.match(/₹(\d+)/)?.[1] || 0) : 0)
                : 0;
              const comboDiscount = appliedCombo ? Math.round(totalPrice * appliedCombo.discount / 100) : 0;
              const finalTotal = totalPrice - promoDiscount - comboDiscount;
              const deliveryDateStr = deliveryDate === "today" ? "Today" : deliveryDate === "tomorrow" ? "Tomorrow" : customDate || "";
              const items = Object.entries(cart).map(([id, qty]) => {
                const item = allItems.find((i) => i.id === Number(id));
                return { id: Number(id), name: item?.name, price: item?.price, qty };
              });
              const saved = await saveOrder({
                customerName: orderInfo.customerName || "Guest",
                contact:      orderInfo.contact || orderInfo.address,
                email:        orderInfo.email || "",
                orderType:    orderInfo.orderType,
                address:      orderInfo.address,
                items,
                subtotal:     totalPrice,
                discount:     promoDiscount,
                comboDiscount,
                total:        finalTotal,
                promoCode:    appliedPromo?.code || "",
                deliveryDate: deliveryDateStr,
                notes:        `${orderNotes} | UPI TXN: ${txnId}`,
              });
              if (saved?.id) setPlacedOrderId(saved.id);
              applyReferralOnOrder(orderInfo.contact || orderInfo.address);
              setOrderLoading(false);
              setOrderPlaced(true);
              setShowPayment(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default OrderMenu;
