import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// 1. DREAM DESSERT — mood → cake suggestion
// ─────────────────────────────────────────────────────────────────────────────
const MOOD_SUGGESTIONS = [
  { mood: "summer",      emoji: "🍋", name: "Lemon Lavender Chiffon",      price: "₹420", desc: "Light sponge with fresh lemon zest and dried lavender, finished with a honey glaze.", img: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=400&q=80" },
  { mood: "winter",      emoji: "🍫", name: "Dark Chocolate Spice Cake",   price: "₹520", desc: "Rich cocoa layers with cinnamon, cardamom, and a hint of chili. Dusted with cocoa.", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80" },
  { mood: "cozy",        emoji: "🍎", name: "Brown Butter Apple Cake",     price: "₹450", desc: "Caramelized apple slices in nutty brown butter batter. Crunchy oat crumble on top.", img: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=400&q=80" },
  { mood: "romantic",    emoji: "🌹", name: "Rose & Raspberry Cheesecake", price: "₹580", desc: "Velvety cream cheese with rose-infused raspberry coulis. Edible rose petals.", img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=80" },
  { mood: "tropical",    emoji: "🥭", name: "Mango Coconut Mousse",        price: "₹490", desc: "Crisp shells filled with mango curd and coconut buttercream. Pure tropics.", img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80" },
  { mood: "birthday",    emoji: "🎂", name: "Confetti Celebration Cake",   price: "₹480", desc: "Vanilla sponge with rainbow sprinkles, whipped cream, and gold leaf finish.", img: "https://images.unsplash.com/photo-1607478900766-efe13248b125?auto=format&fit=crop&w=400&q=80" },
  { mood: "coffee",      emoji: "☕", name: "Espresso Tiramisu Cake",      price: "₹510", desc: "Mascarpone layers soaked in espresso, dusted with premium cocoa powder.", img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80" },
  { mood: "happy",       emoji: "😊", name: "Strawberry Shortcake",        price: "₹450", desc: "Fresh strawberries, whipped cream, light vanilla sponge. Pure joy.", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80" },
  { mood: "sad",         emoji: "🍫", name: "Triple Chocolate Fudge",      price: "₹540", desc: "Three layers of chocolate — dark, milk, white. The ultimate comfort cake.", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80" },
  { mood: "celebration", emoji: "🎉", name: "Gold Leaf Opera Cake",        price: "₹1899", desc: "Coffee buttercream, almond joconde, edible gold leaf. A true showstopper.", img: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=400&q=80" },
];
const MOOD_CHIPS = ["Summer","Winter","Cozy","Romantic","Tropical","Birthday","Coffee","Happy","Sad","Celebration"];

// ─────────────────────────────────────────────────────────────────────────────
// 2. CUSTOM FLAVOURS — special combos
// ─────────────────────────────────────────────────────────────────────────────
const FLAVOUR_BASES = [
  { id: "chocolate", label: "Chocolate",    emoji: "🍫", color: "#3d1f00" },
  { id: "vanilla",   label: "Vanilla",      emoji: "🤍", color: "#2a1f0a" },
  { id: "mango",     label: "Mango",        emoji: "🥭", color: "#2a1800" },
  { id: "strawberry",label: "Strawberry",   emoji: "🍓", color: "#2a0a0a" },
  { id: "coffee",    label: "Coffee",       emoji: "☕", color: "#1a1008" },
  { id: "pistachio", label: "Pistachio",    emoji: "🌿", color: "#0a1a0a" },
];
const FLAVOUR_FILLINGS = [
  { id: "ganache",   label: "Dark Ganache",    emoji: "🍫" },
  { id: "cream",     label: "Whipped Cream",   emoji: "🤍" },
  { id: "caramel",   label: "Salted Caramel",  emoji: "🍮" },
  { id: "berry",     label: "Berry Compote",   emoji: "🫐" },
  { id: "custard",   label: "Vanilla Custard", emoji: "🥛" },
  { id: "nutella",   label: "Nutella",         emoji: "🌰" },
];
const FLAVOUR_TOPPINGS = [
  { id: "gold",      label: "Gold Leaf",       emoji: "✨" },
  { id: "berries",   label: "Fresh Berries",   emoji: "🍓" },
  { id: "flowers",   label: "Edible Flowers",  emoji: "🌸" },
  { id: "choco",     label: "Choco Shards",    emoji: "🍫" },
  { id: "nuts",      label: "Roasted Nuts",    emoji: "🌰" },
  { id: "sprinkles", label: "Sprinkles",       emoji: "🎊" },
];

function getFlavourResult(base, filling, topping) {
  const names = {
    chocolate: "Chocolate", vanilla: "Vanilla", mango: "Mango",
    strawberry: "Strawberry", coffee: "Coffee", pistachio: "Pistachio",
  };
  const fillNames = {
    ganache: "Ganache", cream: "Cream", caramel: "Caramel",
    berry: "Berry", custard: "Custard", nutella: "Nutella",
  };
  const topNames = {
    gold: "Gold Leaf", berries: "Fresh Berries", flowers: "Edible Flowers",
    choco: "Choco Shards", nuts: "Roasted Nuts", sprinkles: "Sprinkles",
  };
  const b = FLAVOUR_BASES.find(x => x.id === base);
  const f = FLAVOUR_FILLINGS.find(x => x.id === filling);
  const t = FLAVOUR_TOPPINGS.find(x => x.id === topping);
  const name = `${names[base]} ${fillNames[filling]} Cake`;
  const desc = `${b?.emoji} ${names[base]} sponge layered with ${fillNames[filling].toLowerCase()}, finished with ${topNames[topping].toLowerCase()}. A truly custom creation.`;
  const price = (base === "pistachio" || topping === "gold") ? "₹1,299" : "₹699";
  return { name, desc, price, emojis: [b?.emoji, f?.emoji, t?.emoji] };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. GIFT BUILDER
// ─────────────────────────────────────────────────────────────────────────────
const GIFT_ITEMS = [
  { id: "cake",      label: "Signature Cake",   emoji: "🎂", price: 520  },
  { id: "brownies",  label: "Fudge Brownies",   emoji: "🍫", price: 270  },
  { id: "macarons",  label: "Macarons (6pc)",   emoji: "🫐", price: 280  },
  { id: "cookies",   label: "Butter Cookies",   emoji: "🍪", price: 180  },
  { id: "croissant", label: "Croissants (4pc)", emoji: "🥐", price: 480  },
  { id: "hot_choc",  label: "Hot Chocolate",    emoji: "☕", price: 195  },
];
const GIFT_WRAPS = [
  { id: "classic",  label: "Classic Gold Box",   emoji: "📦", price: 0   },
  { id: "premium",  label: "Premium Hamper",     emoji: "🎁", price: 150 },
  { id: "luxury",   label: "Luxury Ribbon Box",  emoji: "✨", price: 300 },
];
const GIFT_NOTES = [
  { id: "birthday",  label: "Happy Birthday!",    emoji: "🎂" },
  { id: "love",      label: "With Love",          emoji: "❤️" },
  { id: "congrats",  label: "Congratulations!",   emoji: "🎊" },
  { id: "thankyou",  label: "Thank You",          emoji: "🙏" },
  { id: "custom",    label: "Custom Note",        emoji: "✏️" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function DreamDessert() {
  const [mood, setMood] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function generate(val) {
    const m = (val || mood).trim();
    if (!m) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const lower = m.toLowerCase();
      const match = MOOD_SUGGESTIONS.find(s => lower.includes(s.mood));
      setResult(match || {
        emoji: "✨", name: `Custom Bake for "${m}"`, price: "₹499",
        desc: "A unique blend of seasonal ingredients curated to match your vibe. Visit us to taste the creation!",
        img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
      });
      setLoading(false);
    }, 1400);
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* left */}
      <div>
        <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
          Type your mood or pick a vibe below 👇
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {MOOD_CHIPS.map(m => (
            <motion.button key={m} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setMood(m); generate(m); }}
              className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full transition-all"
              style={{
                background: mood === m ? "rgba(212,168,67,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${mood === m ? "rgba(212,168,67,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: mood === m ? "#D4A843" : "rgba(255,255,255,0.4)",
              }}>{m}</motion.button>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={mood} onChange={e => setMood(e.target.value)}
            onKeyDown={e => e.key === "Enter" && generate()}
            placeholder="e.g. Rainy evening, Cozy Sunday..."
            className="flex-1 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            onFocus={e => e.target.style.borderColor = "rgba(212,168,67,0.4)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
          />
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => generate()} disabled={loading || !mood.trim()}
            className="px-5 py-3 rounded-2xl text-sm font-bold disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#C9973A,#8B6914)", color: "#0a0800" }}>
            {loading ? "..." : "✨"}
          </motion.button>
        </div>
      </div>
      {/* right */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="rounded-2xl p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-full border-2 border-t-transparent"
              style={{ borderColor: "rgba(212,168,67,0.4)", borderTopColor: "transparent" }}/>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Crafting your perfect bake...</p>
          </motion.div>
        ) : result ? (
          <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(212,168,67,0.2)" }}>
            <div className="relative h-40 overflow-hidden">
              <img src={result.img} alt={result.name} className="w-full h-full object-cover"/>
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}/>
              <span className="absolute bottom-3 left-4 text-2xl">{result.emoji}</span>
              <span className="absolute bottom-3 right-4 text-white font-bold text-lg">{result.price}</span>
            </div>
            <div className="p-5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <h4 className="text-base font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{result.name}</h4>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{result.desc}</p>
              <a href={`https://wa.me/919131401594?text=Hi!%20I'd%20like%20to%20order%20${encodeURIComponent(result.name)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold"
                style={{ background: "#25D366", color: "#fff" }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.727.977.994-3.634-.235-.374A9.818 9.818 0 1112 21.818z"/></svg>
                Order This Cake
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-4xl opacity-20">🎂</div>
            <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.2)" }}>Your dream dessert will appear here</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CustomFlavours() {
  const [base, setBase] = useState(null);
  const [filling, setFilling] = useState(null);
  const [topping, setTopping] = useState(null);
  const [result, setResult] = useState(null);

  function handleGenerate() {
    if (!base || !filling || !topping) return;
    setResult(getFlavourResult(base, filling, topping));
  }

  function reset() { setBase(null); setFilling(null); setTopping(null); setResult(null); }

  const SelectRow = ({ label, items, selected, onSelect, color }) => (
    <div className="mb-5">
      <p className="text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2"
        style={{ color: "rgba(212,168,67,0.6)" }}>
        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
          style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}>
          {label[0]}
        </span>
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map(item => {
          const isSel = selected === item.id;
          return (
            <motion.button key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { onSelect(item.id); setResult(null); }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: isSel ? "rgba(212,168,67,0.15)" : "rgba(255,255,255,0.04)",
                border: `1.5px solid ${isSel ? "rgba(212,168,67,0.5)" : "rgba(255,255,255,0.07)"}`,
                color: isSel ? "#D4A843" : "rgba(255,255,255,0.55)",
              }}>
              <span>{item.emoji}</span> {item.label}
              {isSel && <span className="text-[10px]">✓</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      {/* special badge */}
      <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
        style={{ background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.2)" }}>
        <span className="text-base">👑</span>
        <span className="text-xs font-semibold" style={{ color: "#D4A843" }}>Build your signature flavour — 100% custom</span>
      </div>

      <SelectRow label="Base Sponge" items={FLAVOUR_BASES} selected={base} onSelect={setBase} />
      <SelectRow label="Filling" items={FLAVOUR_FILLINGS} selected={filling} onSelect={setFilling} />
      <SelectRow label="Topping" items={FLAVOUR_TOPPINGS} selected={topping} onSelect={setTopping} />

      {/* progress dots */}
      <div className="flex items-center gap-2 mb-5">
        {[base, filling, topping].map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full transition-all"
              style={{ background: v ? "#D4A843" : "rgba(255,255,255,0.15)" }}/>
            {i < 2 && <div className="w-6 h-px" style={{ background: "rgba(255,255,255,0.1)" }}/>}
          </div>
        ))}
        <span className="text-[10px] ml-2" style={{ color: "rgba(255,255,255,0.3)" }}>
          {[base, filling, topping].filter(Boolean).length}/3 selected
        </span>
      </div>

      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        onClick={handleGenerate} disabled={!base || !filling || !topping}
        className="w-full py-3.5 rounded-2xl text-sm font-bold uppercase tracking-widest mb-5 disabled:opacity-40"
        style={{ background: "linear-gradient(135deg,#C9973A,#8B6914)", color: "#0a0800" }}>
        ✨ Create My Signature Cake →
      </motion.button>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{ background: "rgba(212,168,67,0.06)", border: "1.5px solid rgba(212,168,67,0.25)" }}>
            <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(212,168,67,0.1) 0%, transparent 70%)" }}/>
            <div className="flex items-start gap-4">
              <div className="text-4xl flex gap-1">{result.emojis?.map((e,i) => <span key={i}>{e}</span>)}</div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(212,168,67,0.6)" }}>Your Signature Creation</p>
                <h4 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{result.name}</h4>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>{result.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold" style={{ color: "#D4A843" }}>{result.price}</span>
                  <div className="flex gap-2">
                    <button onClick={reset} className="text-xs px-3 py-1.5 rounded-xl transition"
                      style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      Reset
                    </button>
                    <a href={`https://wa.me/919131401594?text=Hi!%20I'd%20like%20to%20order%20a%20custom%20${encodeURIComponent(result.name)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-xs px-4 py-1.5 rounded-xl font-bold"
                      style={{ background: "#25D366", color: "#fff" }}>
                      Order →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GiftBuilder() {
  const [selected, setSelected] = useState([]);
  const [wrap, setWrap] = useState("classic");
  const [note, setNote] = useState(null);
  const [customNote, setCustomNote] = useState("");
  const [done, setDone] = useState(false);

  function toggleItem(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const itemTotal = selected.reduce((sum, id) => {
    const item = GIFT_ITEMS.find(x => x.id === id);
    return sum + (item?.price || 0);
  }, 0);
  const wrapPrice = GIFT_WRAPS.find(x => x.id === wrap)?.price || 0;
  const total = itemTotal + wrapPrice;

  const whatsappMsg = `Hi Krishna Bakers! I'd like to build a gift box with: ${selected.map(id => GIFT_ITEMS.find(x => x.id === id)?.label).join(", ")}. Wrap: ${GIFT_WRAPS.find(x => x.id === wrap)?.label}. Note: ${note === "custom" ? customNote : GIFT_NOTES.find(x => x.id === note)?.label || "None"}. Total: ₹${total}`;

  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8">
      <div className="text-5xl mb-4">🎁</div>
      <h4 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Gift Box Ready!</h4>
      <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>{selected.length} items · {GIFT_WRAPS.find(x => x.id === wrap)?.label}</p>
      <p className="text-2xl font-bold mb-6" style={{ color: "#D4A843" }}>₹{total}</p>
      <div className="flex gap-3 justify-center">
        <a href={`https://wa.me/919131401594?text=${encodeURIComponent(whatsappMsg)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold"
          style={{ background: "#25D366", color: "#fff" }}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.727.977.994-3.634-.235-.374A9.818 9.818 0 1112 21.818z"/></svg>
          Order Gift Box
        </a>
        <button onClick={() => { setSelected([]); setWrap("classic"); setNote(null); setCustomNote(""); setDone(false); }}
          className="px-6 py-3 rounded-2xl text-sm font-bold"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
          🔄 Rebuild
        </button>
      </div>
    </motion.div>
  );

  return (
    <div>
      {/* Items */}
      <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(212,168,67,0.6)" }}>1. Pick Items</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
        {GIFT_ITEMS.map(item => {
          const isSel = selected.includes(item.id);
          return (
            <motion.button key={item.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => toggleItem(item.id)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all"
              style={{
                background: isSel ? "rgba(212,168,67,0.12)" : "rgba(255,255,255,0.04)",
                border: `1.5px solid ${isSel ? "rgba(212,168,67,0.4)" : "rgba(255,255,255,0.07)"}`,
              }}>
              <span className="text-xl">{item.emoji}</span>
              <div>
                <p className="text-[11px] font-semibold leading-tight" style={{ color: isSel ? "#D4A843" : "rgba(255,255,255,0.7)" }}>{item.label}</p>
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>₹{item.price}</p>
              </div>
              {isSel && <span className="ml-auto text-xs text-amber-400">✓</span>}
            </motion.button>
          );
        })}
      </div>

      {/* Wrap */}
      <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(212,168,67,0.6)" }}>2. Choose Packaging</p>
      <div className="flex gap-2 mb-6">
        {GIFT_WRAPS.map(w => (
          <motion.button key={w.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setWrap(w.id)}
            className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all"
            style={{
              background: wrap === w.id ? "rgba(212,168,67,0.12)" : "rgba(255,255,255,0.04)",
              border: `1.5px solid ${wrap === w.id ? "rgba(212,168,67,0.4)" : "rgba(255,255,255,0.07)"}`,
            }}>
            <span className="text-2xl">{w.emoji}</span>
            <span className="text-[10px] font-semibold" style={{ color: wrap === w.id ? "#D4A843" : "rgba(255,255,255,0.6)" }}>{w.label}</span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{w.price === 0 ? "Free" : `+₹${w.price}`}</span>
          </motion.button>
        ))}
      </div>

      {/* Note */}
      <p className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(212,168,67,0.6)" }}>3. Add a Note</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {GIFT_NOTES.map(n => (
          <motion.button key={n.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setNote(n.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: note === n.id ? "rgba(212,168,67,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${note === n.id ? "rgba(212,168,67,0.4)" : "rgba(255,255,255,0.07)"}`,
              color: note === n.id ? "#D4A843" : "rgba(255,255,255,0.5)",
            }}>
            {n.emoji} {n.label}
          </motion.button>
        ))}
      </div>
      {note === "custom" && (
        <input type="text" placeholder="Write your message..." value={customNote}
          onChange={e => setCustomNote(e.target.value)}
          className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none mb-4"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          onFocus={e => e.target.style.borderColor = "rgba(212,168,67,0.4)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />
      )}

      {/* Summary + CTA */}
      {selected.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-2xl mb-4"
          style={{ background: "rgba(212,168,67,0.06)", border: "1px solid rgba(212,168,67,0.15)" }}>
          <div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{selected.length} items + packaging</p>
            <p className="text-xl font-bold" style={{ color: "#D4A843" }}>₹{total}</p>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => setDone(true)}
            className="px-6 py-3 rounded-xl text-sm font-bold"
            style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}>
            Build Gift Box →
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "dream",   label: "Dream Dessert",   emoji: "✨", desc: "Mood → Cake" },
  { id: "flavour", label: "Custom Flavours", emoji: "🎨", desc: "Build your own" },
  { id: "gift",    label: "Gift Builder",    emoji: "🎁", desc: "Build a gift box" },
];

export default function AICustomizer() {
  const [activeTab, setActiveTab] = useState("dream");
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="ai-customizer" ref={ref}
      style={{ background: "linear-gradient(180deg, #0a0804 0%, #0d0b06 100%)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-24">

        {/* header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }} className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.5em] mb-4" style={{ color: "rgba(212,168,67,0.55)" }}>Interactive Tools</p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-3"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.02em" }}>
            Create Something
            <br />
            <em className="font-bold italic" style={{
              background: "linear-gradient(135deg, #C9973A, #F0CC6E)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>Truly Yours</em>
          </h2>
        </motion.div>

        {/* tab switcher */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex gap-3 justify-center mb-10 flex-wrap">
          {TABS.map(tab => (
            <motion.button key={tab.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl transition-all"
              style={activeTab === tab.id ? {
                background: "linear-gradient(135deg,rgba(212,168,67,0.15),rgba(139,105,20,0.1))",
                border: "1.5px solid rgba(212,168,67,0.4)",
              } : {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
              <span className="text-xl">{tab.emoji}</span>
              <div className="text-left">
                <p className="text-xs font-bold leading-tight"
                  style={{ color: activeTab === tab.id ? "#D4A843" : "rgba(255,255,255,0.7)" }}>
                  {tab.label}
                </p>
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{tab.desc}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* tab content */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-3xl mx-auto rounded-3xl p-8"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(212,168,67,0.1)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
          }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}>
              {activeTab === "dream"   && <DreamDessert />}
              {activeTab === "flavour" && <CustomFlavours />}
              {activeTab === "gift"    && <GiftBuilder />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
