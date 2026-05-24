import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { saveChatLead } from "../services/leadService";

// ─── WhatsApp number (India +91) ──────────────────────────────────────────────
const WHATSAPP_NUMBER = "919131401594";

function openWhatsApp(name, contact) {
  const msg = name
    ? `Hi Krishna Bakers! I'm ${name}${contact ? ` (${contact})` : ""}. I'd like to place an order.`
    : "Hi Krishna Bakers! I'd like to place an order.";
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

// ─── All products / menu items ────────────────────────────────────────────────
// IDs MUST match OrderMenu.js menuData IDs exactly for highlight to work
const ALL_PRODUCTS = [
  { id: 1,  name: "Classic English Cake",    category: "Cakes",      price: 450, desc: "Light sponge, no frosting, baked fresh daily.",        emoji: "🎂", tag: "Bestseller", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80" },
  { id: 2,  name: "Velvet Cheesecake",       category: "Cakes",      price: 380, desc: "New York style baked cheesecake, rich and creamy.",     emoji: "🍰", tag: "Bestseller", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=80" },
  { id: 3,  name: "Chocolate Truffle Cake",        category: "Cakes",      price: 520,  desc: "Dark chocolate ganache layered cake.",                  emoji: "🍫", tag: "",           image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80" },
  { id: 4,  name: "Mango Mousse Cake",             category: "Cakes",      price: 490,  desc: "Fresh mango pulp with light mousse layers.",            emoji: "🥭", tag: "Seasonal",   image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80" },
  { id: 5,  name: "Butterscotch Cake",             category: "Cakes",      price: 420,  desc: "Classic butterscotch with caramel drizzle.",            emoji: "🍮", tag: "",           image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=400&q=80" },
  { id: 16, name: "Chocolate Rouge Reverie",       category: "Cakes",      price: 1499, desc: "Eggless dark chocolate mousse with ruby red berry glaze. A showstopper.", emoji: "🍫", tag: "Luxe", image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=400&q=80" },
  { id: 17, name: "Midnight Blueberry Cheesecake", category: "Cakes",      price: 1199, desc: "Velvety cheesecake topped with fresh blueberry compote on a buttery crust.", emoji: "🫐", tag: "Luxe", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=80" },
  { id: 18, name: "Luxe Mango Cheese Cake",        category: "Cakes",      price: 1399, desc: "Creamy mango cheesecake with fresh alphonso mango topping.", emoji: "🥭", tag: "Luxe",  image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80" },
  { id: 19, name: "Fresh Mango Cream Cake",        category: "Cakes",      price: 1499, desc: "Soft sponge layered with fresh mango cream and mango glaze.", emoji: "🥭", tag: "Luxe", image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=400&q=80" },
  { id: 20, name: "Cocoa Hazelnut Mousse",         category: "Cakes",      price: 2499, desc: "Eggless cocoa hazelnut mousse cake with praline crunch. Premium gifting.", emoji: "🌰", tag: "Luxe", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80" },
  { id: 6,  name: "Croissant",               category: "Pastries",   price: 120, desc: "Flaky, buttery, baked fresh every morning.",            emoji: "🥐", tag: "",           image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80" },
  { id: 7,  name: "Pain au Chocolat",        category: "Pastries",   price: 150, desc: "Croissant dough wrapped around dark chocolate.",        emoji: "🍫", tag: "",           image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=400&q=80" },
  { id: 8,  name: "Almond Danish",           category: "Pastries",   price: 160, desc: "Puff pastry with almond cream filling.",                emoji: "🥐", tag: "",           image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=400&q=80" },
  { id: 9,  name: "Classic Fudge Brownie",   category: "Brownies",   price: 90,  desc: "Dense, fudgy, with a crinkle top.",                    emoji: "🍫", tag: "Bestseller", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80" },
  { id: 10, name: "Walnut Brownie",          category: "Brownies",   price: 100, desc: "Fudge brownie loaded with walnuts.",                   emoji: "🌰", tag: "",           image: "https://images.unsplash.com/photo-1589375462-390b7e0b5e5e?auto=format&fit=crop&w=400&q=80" },
  { id: 11, name: "Cream Cheese Brownie",    category: "Brownies",   price: 110, desc: "Swirled cream cheese on fudge base.",                  emoji: "🍰", tag: "",           image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=400&q=80" },
  { id: 12, name: "Hot Chocolate",           category: "Beverages",  price: 195, desc: "Rich Belgian chocolate, 250ml.",                       emoji: "☕", tag: "Bestseller", image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=400&q=80" },
  { id: 13, name: "Cold Coffee",             category: "Beverages",  price: 180, desc: "Chilled espresso with milk and ice.",                  emoji: "🧋", tag: "",           image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80" },
  { id: 14, name: "Masala Chai",             category: "Beverages",  price: 80,  desc: "Spiced Indian tea, freshly brewed.",                   emoji: "🍵", tag: "",           image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80" },
  // Parisian Macarons — only in chat menu (not in OrderMenu), id 15 safe to keep
  { id: 15, name: "Parisian Macarons",       category: "Pastries",   price: 280, desc: "Delicate French macarons in seasonal flavours.",        emoji: "🫐", tag: "Trending",   image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=400&q=80" },
];

const CATEGORIES = [...new Set(ALL_PRODUCTS.map((p) => p.category))];

// ─── Chat steps ───────────────────────────────────────────────────────────────
// STEP: 'greeting' → 'name' → 'contact' → 'category' → 'products' → 'product_detail' → 'done'

function botMsg(text, extra = {}) {
  return { from: "bot", text, ...extra };
}
function userMsg(text) {
  return { from: "user", text };
}

const INITIAL_MESSAGES = [
  botMsg(
    "Hi there! 👋 Welcome to **Krishna Bakers**.\nI'm your virtual baker assistant — here to help you find the perfect treat! 🎂\n\nYou can also tap the **WhatsApp** button above to chat directly with our baker.",
    { step: "greeting" }
  ),
  botMsg("To get started, may I know your **name**? 😊"),
];

export default function ChatButton({ onOrderNow }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [step, setStep] = useState("name"); // current expected input step
  const [input, setInput] = useState("");
  const [userData, setUserData] = useState({ name: "", contact: "" });

  const bottomRef = useRef(null);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  function addMessages(msgs) {
    setMessages((prev) => [...prev, ...msgs]);
  }

  // ── Handle text input send ──────────────────────────────────────────────────
  function handleSend() {
    const val = input.trim();
    if (!val) return;
    setInput("");

    if (step === "name") {
      const name = val;
      setUserData((u) => ({ ...u, name }));
      addMessages([
        userMsg(val),
        botMsg(`Nice to meet you, **${name}**! 😊`),
        botMsg("Could you share your **email or phone number** so we can reach you if needed?"),
      ]);
      setStep("contact");
      return;
    }

    if (step === "contact") {
      const contact = val;

      // ── Validation ──────────────────────────────────────────────────────────
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[6-9]\d{9}$/; // Indian 10-digit mobile
      const cleanPhone = contact.replace(/[\s\-+]/g, "").replace(/^91/, "");

      const isValidEmail = emailRegex.test(contact);
      const isValidPhone = phoneRegex.test(cleanPhone);

      if (!isValidEmail && !isValidPhone) {
        addMessages([
          userMsg(val),
          botMsg(
            `⚠️ That doesn't look valid.\n\nPlease enter:\n• A valid **email** — e.g. name@gmail.com\n• Or a **10-digit mobile number** — e.g. 9876543210`
          ),
        ]);
        setInput("");
        return;
      }

      const displayContact = isValidPhone ? `+91 ${cleanPhone}` : contact;
      setUserData((u) => ({ ...u, contact: displayContact }));

      // ── Save lead to Supabase ──────────────────────────────────────────────
      saveChatLead(userData.name, displayContact);
      addMessages([
        userMsg(val),
        botMsg(`Perfect! ✅ We'll reach you at **${displayContact}**.`),
        botMsg(
          `Now, what are you in the mood for today, **${userData.name}**? 🍰\nPick a category or search below 👇`,
          { step: "category" }
        ),
      ]);
      setStep("category");
      return;
    }

    // free-text search during product/category step
    if (step === "products" || step === "category" || step === "product_detail" || step === "product_action") {
      const query = val.toLowerCase();
      const found = ALL_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.desc.toLowerCase().includes(query)
      );
      addMessages([userMsg(val)]);
      if (found.length > 0) {
        addMessages([
          botMsg(`Here's what I found for "**${val}**" 🔍`, { products: found }),
        ]);
        setStep("product_detail");
      } else {
        addMessages([
          botMsg(`Hmm, I couldn't find anything for "**${val}**". Try picking a category below 👇`, { step: "category" }),
        ]);
        setStep("category");
      }
      return;
    }
  }

  // ── Category chip click ─────────────────────────────────────────────────────
  function handleCategoryClick(cat) {
    const items = ALL_PRODUCTS.filter((p) => p.category === cat);
    addMessages([
      userMsg(cat),
      botMsg(`Great choice! Here are our **${cat}** 👇`, { products: items }),
    ]);
    setStep("product_detail");
  }

  // ── Product card click ──────────────────────────────────────────────────────
  function handleProductClick(product) {
    addMessages([
      userMsg(product.name),
      botMsg(
        `${product.emoji} **${product.name}**\n\n📝 ${product.desc}\n💰 Price: ₹${product.price}${product.tag ? `\n🏷️ ${product.tag}` : ""}`,
        { productDetail: product }
      ),
      botMsg(
        `Would you like to order **${product.name}**? 🛒\nOr explore more items?`,
        { step: "product_action", product }
      ),
    ]);
    setStep("product_action");
  }

  // ── Action buttons after product detail ────────────────────────────────────
  function handleProductAction(action, product) {
    if (action === "order") {
      // Close chat and open OrderMenu with this product highlighted
      setIsOpen(false);
      if (onOrderNow) onOrderNow(product);
    } else if (action === "more") {
      addMessages([
        userMsg("Explore More"),
        botMsg("Sure! Pick another category 👇", { step: "category" }),
      ]);
      setStep("category");
    }
  }

  // ── Restart ─────────────────────────────────────────────────────────────────
  function handleRestart() {
    setMessages(INITIAL_MESSAGES);
    setStep("name");
    setUserData({ name: "", contact: "" });
    setInput("");
  }

  // ── Render a single message ─────────────────────────────────────────────────
  function renderMessage(msg, idx) {
    const isBot = msg.from === "bot";

    return (
      <div key={idx} className={`flex ${isBot ? "justify-start" : "justify-end"} mb-2`}>
        {isBot && (
          <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-sm mr-2 shrink-0 mt-1">
            🧑‍🍳
          </div>
        )}
        <div className={`max-w-[80%] ${isBot ? "" : "items-end flex flex-col"}`}>
          {/* text bubble */}
          {msg.text && (
            <div
              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                isBot
                  ? "bg-gray-100 text-gray-800 rounded-tl-none"
                  : "bg-amber-900 text-white rounded-tr-none"
              }`}
              dangerouslySetInnerHTML={{
                __html: msg.text
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\n/g, "<br/>"),
              }}
            />
          )}

          {/* Category chips — premium grid */}
          {msg.step === "category" && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {CATEGORIES.map((cat) => {
                const meta = {
                  Cakes:     { icon: "🎂", color: "from-amber-50 to-orange-50 border-amber-200 text-amber-900" },
                  Pastries:  { icon: "🥐", color: "from-yellow-50 to-amber-50 border-yellow-200 text-yellow-900" },
                  Brownies:  { icon: "🍫", color: "from-stone-50 to-amber-50 border-stone-200 text-stone-800" },
                  Beverages: { icon: "☕", color: "from-sky-50 to-blue-50 border-sky-200 text-sky-900" },
                }[cat] || { icon: "🍴", color: "from-gray-50 to-gray-100 border-gray-200 text-gray-800" };
                return (
                  <button
                    key={cat}
                    onClick={() => step === "category" && handleCategoryClick(cat)}
                    className={`bg-gradient-to-br ${meta.color} border rounded-xl px-3 py-2.5 text-left hover:shadow-sm transition-all`}
                  >
                    <span className="text-xl block mb-1">{meta.icon}</span>
                    <span className="text-xs font-semibold">{cat}</span>
                    <span className="text-[10px] text-gray-400 block">
                      {ALL_PRODUCTS.filter(p => p.category === cat).length} items
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Product cards — with image thumbnail */}
          {msg.products && (
            <div className="mt-2 flex flex-col gap-2 w-full">
              {msg.products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => (step === "product_detail" || step === "category") && handleProductClick(p)}
                  className="bg-white border border-gray-100 rounded-2xl text-left hover:border-amber-300 hover:shadow-md transition-all overflow-hidden flex items-center gap-0 w-full group"
                >
                  {/* image */}
                  <div className="w-16 h-16 shrink-0 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.style.display = "none"; e.target.parentNode.innerHTML = `<span class='text-2xl flex items-center justify-center w-full h-full bg-amber-50'>${p.emoji}</span>`; }}
                    />
                  </div>
                  {/* info */}
                  <div className="flex-1 min-w-0 px-3 py-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                      {p.tag && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full shrink-0 font-medium">{p.tag}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate leading-tight">{p.desc}</p>
                  </div>
                  {/* price */}
                  <div className="pr-3 shrink-0 text-right">
                    <p className="text-sm font-bold text-amber-800">₹{p.price}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Product detail card — large image + full info */}
          {msg.productDetail && (
            <div className="mt-2 bg-white border border-amber-100 rounded-2xl overflow-hidden w-full shadow-sm">
              {/* hero image */}
              <div className="relative h-36 overflow-hidden bg-amber-50">
                <img
                  src={msg.productDetail.image}
                  alt={msg.productDetail.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = "none"; e.target.parentNode.innerHTML = `<div class='flex items-center justify-center h-full text-5xl'>${msg.productDetail.emoji}</div>`; }}
                />
                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* tag badge */}
                {msg.productDetail.tag && (
                  <span className="absolute top-2 left-2 text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                    {msg.productDetail.tag}
                  </span>
                )}
                {/* price on image */}
                <span className="absolute bottom-2 right-3 text-white font-bold text-base drop-shadow">
                  ₹{msg.productDetail.price}
                </span>
              </div>
              {/* details */}
              <div className="px-4 py-3">
                <p className="text-sm font-bold text-gray-900">{msg.productDetail.name}</p>
                <p className="text-xs text-amber-700 font-medium mt-0.5">{msg.productDetail.category}</p>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{msg.productDetail.desc}</p>
              </div>
            </div>
          )}

          {/* Order / Explore more action buttons */}
          {msg.step === "product_action" && msg.product && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => step === "product_action" && handleProductAction("order", msg.product)}
                className="flex-1 bg-amber-900 text-white text-xs font-semibold py-2 rounded-xl hover:bg-amber-800 transition"
              >
                🛒 Order Now
              </button>
              <button
                onClick={() => step === "product_action" && handleProductAction("more", msg.product)}
                className="flex-1 bg-white border border-gray-200 text-gray-700 text-xs font-semibold py-2 rounded-xl hover:bg-gray-50 transition"
              >
                🔍 Explore More
              </button>
            </div>
          )}

          {/* WhatsApp prompt button */}
          {msg.step === "whatsapp_prompt" && (
            <button
              onClick={() => openWhatsApp(msg.name, msg.contact)}
              className="mt-2 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm w-full justify-center"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.727.977.994-3.634-.235-.374A9.818 9.818 0 1112 21.818z"/>
              </svg>
              Chat on WhatsApp
            </button>
          )}

          <button
            onClick={handleRestart}
            className="mt-2 text-xs text-amber-700 underline hover:text-amber-900 transition"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-3">

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 border border-gray-100 flex flex-col overflow-hidden"
          style={{ height: "580px" }}>

          {/* Header */}
          <div className="shrink-0" style={{ background: "linear-gradient(135deg, #78350f 0%, #92400e 60%, #b45309 100%)" }}>
            {/* top row */}
            <div className="px-5 pt-4 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-xl shadow-inner">
                    🧑‍🍳
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-amber-900 rounded-full" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm tracking-wide">Krishna Bakers</p>
                  <p className="text-amber-200 text-[11px]">● Online · Typically replies instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* WhatsApp button in header */}
                <button
                  onClick={() => openWhatsApp(userData.name, userData.contact)}
                  title="Chat on WhatsApp"
                  className="bg-green-500 hover:bg-green-400 text-white p-2 rounded-full transition shadow-md flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.727.977.994-3.634-.235-.374A9.818 9.818 0 1112 21.818z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white text-xl leading-none transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                >
                  ✕
                </button>
              </div>
            </div>
            {/* WhatsApp label strip */}
            <div className="px-5 pb-3 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.727.977.994-3.634-.235-.374A9.818 9.818 0 1112 21.818z"/>
              </svg>
              <span className="text-green-300 text-[11px] font-medium">+91 91314 01594 · Tap 🟢 to WhatsApp us directly</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-[#FAF9F6]">
            {messages.map((msg, idx) => renderMessage(msg, idx))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 px-3 py-3 bg-white shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={
                  step === "name" ? "Type your name..."
                  : step === "contact" ? "Email or phone number..."
                  : "Search cakes, pastries..."
                }
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400 transition bg-gray-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="text-white px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #78350f, #b45309)" }}
              >
                ➤
              </button>
            </div>
            {/* WhatsApp quick link below input */}
            <button
              onClick={() => openWhatsApp(userData.name, userData.contact)}
              className="mt-2 w-full flex items-center justify-center gap-2 text-green-600 hover:text-green-700 text-[11px] font-semibold transition"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.727.977.994-3.634-.235-.374A9.818 9.818 0 1112 21.818z"/>
              </svg>
              Prefer WhatsApp? Tap to chat directly →
            </button>
          </div>
        </div>
      )}

      {/* ── Premium Floating Button ── */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Chat with our baker"
        className="relative flex items-center gap-3 pl-4 pr-5 py-3.5 rounded-full shadow-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a0f00, #3d1f00)",
          border: "1px solid rgba(212,168,67,0.25)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,168,67,0.1)",
        }}
      >
        {/* animated gold ring */}
        <motion.span
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{ boxShadow: ["0 0 0 0px rgba(212,168,67,0.3)", "0 0 0 8px rgba(212,168,67,0)", "0 0 0 0px rgba(212,168,67,0)"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        />

        {/* shimmer sweep */}
        <motion.span
          className="absolute inset-0 -skew-x-12 pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.12), transparent)" }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
        />

        {/* baker avatar */}
        <div className="relative w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, rgba(212,168,67,0.2), rgba(212,168,67,0.05))", border: "1px solid rgba(212,168,67,0.3)" }}>
          <span className="text-base">👨‍🍳</span>
          {/* online dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 bg-green-400"
            style={{ borderColor: "#1a0f00" }}/>
        </div>

        {/* text */}
        <div className="text-left">
          <p className="text-[11px] font-bold text-white leading-tight tracking-wide">Chat with our Baker</p>
          <p className="text-[9px] font-medium" style={{ color: "rgba(212,168,67,0.6)" }}>
            {isOpen ? "Close chat" : "Typically replies instantly"}
          </p>
        </div>

        {/* arrow / close icon */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-1"
        >
          <svg className="w-3.5 h-3.5" style={{ color: "rgba(212,168,67,0.6)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/>
          </svg>
        </motion.div>
      </motion.button>
    </div>
  );
}
