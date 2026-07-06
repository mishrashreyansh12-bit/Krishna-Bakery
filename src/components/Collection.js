import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { useLocation, LOCATION_PRODUCT_MAP, TRANSLATIONS } from "../context/LocationContext";

// ── 48 Premium International Bakery Products ────────────────────────────────
const PRODUCTS = [
  // ── Signature Cakes ──
  { id:1,  name:"Dark Chocolate Truffle",      category:"Signature Cakes",  priceINR:520,  priceUSD:6.25,  mrpINR:650,  stock:5,  tag:"Bestseller",  desc:"72% dark ganache, velvet crumb, zero compromise.",           image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=90&w=800" },
  { id:3,  name:"Velvet Cheesecake",           category:"Signature Cakes",  priceINR:380,  priceUSD:4.56,  mrpINR:450,  stock:8,  tag:"Chef's Pick", desc:"New York style baked cheesecake. Silky & rich.",             image:"https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=90&w=800" },
  { id:11, name:"Mango Mousse Cake",           category:"Signature Cakes",  priceINR:490,  priceUSD:5.88,  mrpINR:590,  stock:3,  tag:"Seasonal",    desc:"Fresh alphonso mango pulp with light mousse layers.",        image:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=90&w=800" },
  { id:21, name:"Strawberry Shortcake",        category:"Signature Cakes",  priceINR:450,  priceUSD:5.40,  mrpINR:450,  stock:12, tag:"Trending",    desc:"Fresh strawberries, whipped cream, vanilla sponge.",        image:"https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=90&w=800" },
  { id:22, name:"Red Velvet Cake",             category:"Signature Cakes",  priceINR:480,  priceUSD:5.76,  mrpINR:580,  stock:7,  tag:"Bestseller",  desc:"Classic red velvet with cream cheese frosting.",            image:"https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&q=90&w=800" },
  { id:23, name:"Lemon Drizzle Cake",          category:"Signature Cakes",  priceINR:360,  priceUSD:4.32,  mrpINR:420,  stock:4,  tag:"Seasonal",    desc:"Zesty lemon sponge with a tangy sugar glaze.",              image:"https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&q=90&w=800" },
  { id:24, name:"Butterscotch Cake",           category:"Signature Cakes",  priceINR:420,  priceUSD:5.04,  mrpINR:420,  stock:15, tag:"Classic",     desc:"Caramel notes, soft crumb, butterscotch drizzle.",          image:"https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=90&w=800" },
  { id:25, name:"Black Forest Gateau",         category:"Signature Cakes",  priceINR:550,  priceUSD:6.60,  mrpINR:650,  stock:6,  tag:"Classic",     desc:"Cherries, dark chocolate, whipped cream layers.",           image:"https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=90&w=800" },

  // ── Luxe Collection ──
  { id:10, name:"Cocoa Hazelnut Mousse",       category:"Luxe Collection",  priceINR:2499, priceUSD:29.99, mrpINR:2999, stock:2,  tag:"Luxe",        desc:"Eggless mousse with praline crunch. Premium gifting.",      image:"https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=90&w=800" },
  { id:26, name:"Midnight Blueberry Tart",     category:"Luxe Collection",  priceINR:1199, priceUSD:14.39, mrpINR:1499, stock:4,  tag:"Luxe",        desc:"Velvety blueberry compote on buttery tart shell.",          image:"https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=90&w=800" },
  { id:27, name:"Gold Leaf Opera Cake",        category:"Luxe Collection",  priceINR:1899, priceUSD:22.79, mrpINR:2299, stock:3,  tag:"Luxe",        desc:"Coffee buttercream, almond joconde, edible gold leaf.",     image:"https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&q=90&w=800" },
  { id:28, name:"Rose Pistachio Entremet",     category:"Luxe Collection",  priceINR:2199, priceUSD:26.39, mrpINR:2599, stock:2,  tag:"Luxe",        desc:"Rose mousse, pistachio dacquoise, mirror glaze.",           image:"https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=90&w=800" },

  // ── Donuts ──
  { id:2,  name:"Glazed Ring Donuts",          category:"Donuts",           priceINR:80,   priceUSD:0.96,  mrpINR:80,   stock:20, tag:"Daily Fresh", desc:"Pillowy soft, mirror-glazed in seasonal flavours.",         image:"https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=90&w=800" },
  { id:29, name:"Chocolate Sprinkle Donut",    category:"Donuts",           priceINR:90,   priceUSD:1.08,  mrpINR:110,  stock:15, tag:"Trending",    desc:"Chocolate dipped with rainbow sprinkles.",                  image:"https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=90&w=800" },
  { id:30, name:"Cinnamon Sugar Donut",        category:"Donuts",           priceINR:70,   priceUSD:0.84,  mrpINR:70,   stock:18, tag:"Classic",     desc:"Warm cinnamon sugar coating on a fluffy base.",             image:"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=90&w=800" },
  { id:31, name:"Strawberry Jam Donut",        category:"Donuts",           priceINR:85,   priceUSD:1.02,  mrpINR:100,  stock:4,  tag:"Bestseller",  desc:"Filled with house-made strawberry jam. Dusted with sugar.", image:"https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=90&w=800" },

  // ── Cupcakes ──
  { id:6,  name:"Vanilla Swirl Cupcake",       category:"Cupcakes",         priceINR:120,  priceUSD:1.44,  mrpINR:150,  stock:10, tag:"Trending",    desc:"Tall swirl frosting on a moist vanilla sponge.",            image:"https://images.unsplash.com/photo-1607478900766-efe13248b125?auto=format&fit=crop&q=90&w=800" },
  { id:32, name:"Red Velvet Cupcake",          category:"Cupcakes",         priceINR:130,  priceUSD:1.56,  mrpINR:160,  stock:8,  tag:"Bestseller",  desc:"Cream cheese frosting on a classic red velvet base.",       image:"https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&q=90&w=800" },
  { id:33, name:"Salted Caramel Cupcake",      category:"Cupcakes",         priceINR:140,  priceUSD:1.68,  mrpINR:140,  stock:12, tag:"Chef's Pick", desc:"Caramel buttercream with a salted caramel drizzle.",        image:"https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&q=90&w=800" },
  { id:34, name:"Lemon Meringue Cupcake",      category:"Cupcakes",         priceINR:135,  priceUSD:1.62,  mrpINR:165,  stock:3,  tag:"Seasonal",    desc:"Lemon curd centre, toasted meringue topping.",              image:"https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&q=90&w=800" },

  // ── Viennoiserie ──
  { id:4,  name:"Butter Croissant",            category:"Viennoiserie",     priceINR:120,  priceUSD:1.44,  mrpINR:120,  stock:25, tag:"Daily Fresh", desc:"81 layers of laminated dough. Baked every morning.",        image:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=90&w=800" },
  { id:12, name:"Pain au Chocolat",            category:"Viennoiserie",     priceINR:150,  priceUSD:1.80,  mrpINR:180,  stock:14, tag:"Classic",     desc:"Croissant dough wrapped around dark chocolate.",            image:"https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&q=90&w=800" },
  { id:35, name:"Almond Croissant",            category:"Viennoiserie",     priceINR:160,  priceUSD:1.92,  mrpINR:200,  stock:5,  tag:"Chef's Pick", desc:"Twice-baked with almond cream and flaked almonds.",         image:"https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&q=90&w=800" },
  { id:36, name:"Kouign-Amann",                category:"Viennoiserie",     priceINR:180,  priceUSD:2.16,  mrpINR:180,  stock:8,  tag:"Artisan",     desc:"Caramelised Breton pastry. Crispy, buttery, flaky.",        image:"https://images.unsplash.com/photo-1574085733277-851d9d856a3a?auto=format&fit=crop&q=90&w=800" },

  // ── Cookies ──
  { id:8,  name:"Butter Cookies",              category:"Cookies",          priceINR:60,   priceUSD:0.72,  mrpINR:75,   stock:30, tag:"Classic",     desc:"Crisp edges, soft centre. Pure butter, no shortcuts.",      image:"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=90&w=800" },
  { id:37, name:"Double Choco Chip Cookie",    category:"Cookies",          priceINR:70,   priceUSD:0.84,  mrpINR:90,   stock:22, tag:"Bestseller",  desc:"Two types of chocolate chips in a chewy base.",             image:"https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=90&w=800" },
  { id:38, name:"Oatmeal Raisin Cookie",       category:"Cookies",          priceINR:55,   priceUSD:0.66,  mrpINR:55,   stock:18, tag:"Classic",     desc:"Hearty oats, plump raisins, warm cinnamon.",                image:"https://images.unsplash.com/photo-1548365328-8c6db3220e4c?auto=format&fit=crop&q=90&w=800" },
  { id:39, name:"Matcha White Choco Cookie",   category:"Cookies",          priceINR:80,   priceUSD:0.96,  mrpINR:100,  stock:6,  tag:"Trending",    desc:"Japanese matcha with white chocolate chunks.",              image:"https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=90&w=800" },

  // ── Brownies ──
  { id:5,  name:"Classic Fudge Brownie",       category:"Brownies",         priceINR:90,   priceUSD:1.08,  mrpINR:110,  stock:16, tag:"Bestseller",  desc:"Dense, fudgy, crinkle top. Our most loved item.",           image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=90&w=800" },
  { id:40, name:"Walnut Brownie",              category:"Brownies",         priceINR:100,  priceUSD:1.20,  mrpINR:120,  stock:11, tag:"Classic",     desc:"Fudge brownie loaded with crunchy California walnuts.",     image:"https://images.unsplash.com/photo-1589375462-390b7e0b5e5e?auto=format&fit=crop&q=90&w=800" },
  { id:41, name:"Cream Cheese Brownie",        category:"Brownies",         priceINR:110,  priceUSD:1.32,  mrpINR:135,  stock:4,  tag:"Chef's Pick", desc:"Swirled cream cheese on a fudge brownie base.",             image:"https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&q=90&w=800" },
  { id:42, name:"Salted Caramel Brownie",      category:"Brownies",         priceINR:115,  priceUSD:1.38,  mrpINR:140,  stock:7,  tag:"Trending",    desc:"Sea salt flakes and caramel swirl on dark chocolate.",      image:"https://images.unsplash.com/photo-1548365328-8c6db3220e4c?auto=format&fit=crop&q=90&w=800" },

  // ── Breads ──
  { id:9,  name:"Artisan Sourdough",           category:"Breads",           priceINR:180,  priceUSD:2.16,  mrpINR:220,  stock:9,  tag:"Artisan",     desc:"72-hour cold ferment. Crackling crust, open crumb.",        image:"https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&q=90&w=800" },
  { id:43, name:"Multigrain Loaf",             category:"Breads",           priceINR:160,  priceUSD:1.92,  mrpINR:160,  stock:13, tag:"Healthy",     desc:"Seeds, grains, and whole wheat. Nutritious & hearty.",      image:"https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=90&w=800" },
  { id:44, name:"Focaccia with Rosemary",      category:"Breads",           priceINR:200,  priceUSD:2.40,  mrpINR:240,  stock:5,  tag:"Artisan",     desc:"Olive oil, sea salt, fresh rosemary. Italian classic.",     image:"https://images.unsplash.com/photo-1574085733277-851d9d856a3a?auto=format&fit=crop&q=90&w=800" },
  { id:45, name:"Cinnamon Raisin Bread",       category:"Breads",           priceINR:170,  priceUSD:2.04,  mrpINR:200,  stock:8,  tag:"Classic",     desc:"Soft enriched dough with cinnamon swirl and raisins.",      image:"https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&q=90&w=800" },

  // ── Tea Cakes ──
  { id:7,  name:"Earl Grey Tea Cake",          category:"Tea Cakes",        priceINR:350,  priceUSD:4.20,  mrpINR:420,  stock:4,  tag:"Seasonal",    desc:"Delicate bergamot sponge with lemon glaze.",                image:"https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=90&w=800" },
  { id:46, name:"Cardamom Honey Cake",         category:"Tea Cakes",        priceINR:320,  priceUSD:3.84,  mrpINR:380,  stock:6,  tag:"Artisan",     desc:"Warm cardamom spice with a honey drizzle finish.",          image:"https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=90&w=800" },
  { id:47, name:"Orange Poppy Seed Cake",      category:"Tea Cakes",        priceINR:300,  priceUSD:3.60,  mrpINR:300,  stock:10, tag:"Classic",     desc:"Zesty orange zest with crunchy poppy seeds.",               image:"https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=90&w=800" },
  { id:48, name:"Chai Spice Loaf",             category:"Tea Cakes",        priceINR:280,  priceUSD:3.36,  mrpINR:340,  stock:3,  tag:"Trending",    desc:"Masala chai spices baked into a moist loaf cake.",          image:"https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=90&w=800" },
];

const TAG_COLORS = {
  "Bestseller":  "#D4A843",
  "Chef's Pick": "rgba(255,255,255,0.65)",
  "Luxe":        "#C9973A",
  "Daily Fresh": "#6DC96D",
  "Artisan":     "#B09FD8",
  "Classic":     "#C8A064",
  "Seasonal":    "#64B496",
  "Trending":    "#F08080",
  "Healthy":     "#7EC8A0",
};

// ── 3D Tilt Card ─────────────────────────────────────────────────────────────
const ProductCard = React.memo(function ProductCard({ product, currency, index, onProductClick }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("kb_wishlist") || "[]");
      return saved.includes(product.id);
    } catch { return false; }
  });
  const [toast, setToast] = useState(false);
  const tagColor = TAG_COLORS[product.tag] || "#D4A843";
  const price = currency === "INR"
    ? `₹${product.priceINR}`
    : `$${product.priceUSD.toFixed(2)}`;

  // MRP / discount
  const hasMrp = product.mrpINR && product.mrpINR > product.priceINR;
  const discountPct = hasMrp ? Math.round((1 - product.priceINR / product.mrpINR) * 100) : 0;
  const mrpDisplay = currency === "INR" ? `₹${product.mrpINR}` : `$${(product.mrpINR / 83.5).toFixed(2)}`;

  function toggleWishlist(e) {
    e.stopPropagation();
    const next = !wishlisted;
    setWishlisted(next);
    try {
      const saved = JSON.parse(localStorage.getItem("kb_wishlist") || "[]");
      const updated = next ? [...saved, product.id] : saved.filter(id => id !== product.id);
      localStorage.setItem("kb_wishlist", JSON.stringify(updated));
    } catch {}
  }

  function handleQuickAdd(e) {
    e.stopPropagation();
    onProductClick?.(product.id);
    setToast(true);
    setTimeout(() => setToast(false), 1800);
  }

  function onMouseMove(e) {
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    gsap.to(cardRef.current, {
      rotateY: x * 18, rotateX: -y * 14, scale: 1.04,
      duration: 0.45, ease: "power2.out",
      transformPerspective: 900,
    });
  }

  function onMouseLeave() {
    gsap.to(cardRef.current, {
      rotateY: 0, rotateX: 0, scale: 1,
      duration: 0.8, ease: "elastic.out(1, 0.5)",
    });
    setHovered(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onMouseLeave}
        onClick={() => onProductClick?.(product.id)}
        className="relative flex-shrink-0 cursor-pointer group"
        style={{ width: "min(240px, 72vw)", transformStyle: "preserve-3d" }}
      >
        {/* image */}
        <div className="relative overflow-hidden rounded-2xl mb-4"
          style={{ height: 300 }}>
          <motion.img
            src={product.image} alt={product.name} loading="lazy"
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: hovered ? "brightness(0.85)" : "brightness(1)", transition: "filter 0.5s ease" }}
          />

          {/* soft gradient overlay — always subtle */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(4,3,1,0.6) 0%, transparent 50%)" }}/>

          {/* hover overlay — deeper */}
          <motion.div className="absolute inset-0"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: "linear-gradient(to top, rgba(4,3,1,0.92) 0%, rgba(4,3,1,0.1) 60%, transparent 100%)" }}
          />

          {/* wishlist heart — top right */}
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 z-10"
            style={{ background: wishlisted ? "rgba(212,168,67,0.25)" : "rgba(0,0,0,0.4)", border: `1px solid ${wishlisted ? "#D4A843" : "rgba(255,255,255,0.2)"}` }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill={wishlisted ? "#D4A843" : "none"} stroke={wishlisted ? "#D4A843" : "rgba(255,255,255,0.7)"} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>

          {/* tag */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <motion.span
              animate={{ opacity: 1 }}
              className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ background: "rgba(0,0,0,0.55)", color: tagColor, border: `1px solid ${tagColor}50`, backdropFilter: "blur(10px)" }}>
              {product.tag}
            </motion.span>
            {/* % OFF badge */}
            {hasMrp && discountPct > 0 && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500 text-white self-start">
                {discountPct}% OFF
              </span>
            )}
          </div>

          {/* stock badge — bottom right on image */}
          {product.stock != null && product.stock <= 5 && (
            <div className="absolute bottom-14 right-3 z-10">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white whitespace-nowrap">
                Only {product.stock} left!
              </span>
            </div>
          )}

          {/* hover — price + CTA */}
          <motion.div className="absolute bottom-0 left-0 right-0 p-4"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {hasMrp && (
                  <span className="text-xs line-through" style={{ color: "rgba(255,255,255,0.4)" }}>{mrpDisplay}</span>
                )}
                <motion.span
                  className="text-lg font-bold"
                  style={{ color: "#D4A843" }}
                  animate={{ scale: hovered ? 1 : 0.9 }}
                  transition={{ duration: 0.3 }}>
                  {price}
                </motion.span>
              </div>
              <div className="flex items-center gap-2">
                {/* Quick Add button */}
                <motion.button
                  onClick={handleQuickAdd}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#C9973A,#8B6914)", color: "#0a0800" }}
                  aria-label="Quick add to cart"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </motion.button>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold"
                  style={{ background: "linear-gradient(135deg,#C9973A,#8B6914)", color: "#0a0800" }}>
                  Order Now →
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* 3D shine */}
          <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)" }}
          />

          {/* click ripple hint */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{ boxShadow: hovered ? "inset 0 0 0 1.5px rgba(212,168,67,0.35)" : "inset 0 0 0 0px rgba(212,168,67,0)" }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* text info */}
        <div className="px-1">
          <motion.p
            className="text-[9px] uppercase tracking-[0.35em] mb-1"
            animate={{ color: hovered ? "rgba(212,168,67,0.75)" : "rgba(212,168,67,0.45)" }}
            transition={{ duration: 0.3 }}>
            {product.category}
          </motion.p>
          <motion.h3
            className="text-sm font-semibold mb-0.5 leading-tight"
            animate={{ color: hovered ? "#ffffff" : "rgba(255,255,255,0.85)" }}
            transition={{ duration: 0.3 }}
            style={{ fontFamily: "'Playfair Display', serif" }}>
            {product.name}
          </motion.h3>
          <p className="text-[11px] leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
            {product.desc}
          </p>
          <div className="flex items-center gap-2">
            <motion.p
              className="text-sm font-bold"
              animate={{ color: hovered ? "#F0CC6E" : "#D4A843" }}
              transition={{ duration: 0.3 }}>
              {price}
            </motion.p>
            {hasMrp && (
              <span className="text-xs line-through" style={{ color: "rgba(255,255,255,0.35)" }}>{mrpDisplay}</span>
            )}
          </div>
        </div>

        {/* Toast notification */}
        {toast && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap"
              style={{ background: "linear-gradient(135deg,#C9973A,#8B6914)", color: "#0a0800" }}>
              Added to cart!
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
});

// ── Horizontal scroll row — CSS marquee + manual drag scroll ─────────────────
function ScrollRow({ products, currency, label, direction = 1, onProductClick }) {
  const [paused, setPaused] = useState(false);
  const rowRef = useRef(null);
  const duration = products.length * 8;

  // Manual drag scroll
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  function onMouseDown(e) {
    isDragging.current = true;
    startX.current = e.pageX - rowRef.current.offsetLeft;
    scrollLeft.current = rowRef.current.scrollLeft;
    setPaused(true);
  }
  function onMouseMove(e) {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - rowRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    rowRef.current.scrollLeft = scrollLeft.current - walk;
  }
  function onMouseUp() { isDragging.current = false; setTimeout(() => setPaused(false), 1500); }

  return (
    <div className="mb-14 md:mb-16">
      <div className="px-1 mb-5">
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "rgba(212,168,67,0.55)" }}>{label}</p>
      </div>

      {/* Auto-scroll marquee strip */}
      <div className="overflow-hidden mb-0">
        <div
          className="flex gap-5"
          style={{
            animation: `${direction > 0 ? "marquee-left" : "marquee-right"} ${duration}s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
            width: "max-content",
          }}>
          {[...products, ...products, ...products].map((p, i) => (
            <div key={`${p.id}-${i}`} style={{ flexShrink: 0 }}>
              <ProductCard product={p} currency={currency} index={i % products.length} onProductClick={onProductClick} />
            </div>
          ))}
        </div>
      </div>

      {/* Manual draggable scroll row below */}
      <div
        ref={rowRef}
        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide mt-4 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollSnapType: "x mandatory" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => { setPaused(false); isDragging.current = false; }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setTimeout(() => setPaused(false), 2000)}
      >
        {products.map((p, i) => (
          <div key={p.id} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
            <ProductCard product={p} currency={currency} index={i} onProductClick={onProductClick} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Collection ───────────────────────────────────────────────────────────
export default function Collection({ onProductClick, jumpCategory, onJumpDone }) {
  const [currency,       setCurrency]       = useState("INR");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy,         setSortBy]         = useState("Default");
  const [minPrice,       setMinPrice]       = useState("");
  const [maxPrice,       setMaxPrice]       = useState("");
  const { location, lang } = useLocation();
  const t = TRANSLATIONS[lang] || TRANSLATIONS["en"];
  const headRef = useRef(null);
  const inView  = useInView(headRef, { once: true });

  // Jump to category from location menu
  useEffect(() => {
    if (jumpCategory) {
      setActiveCategory(jumpCategory);
      onJumpDone?.();
    }
  }, [jumpCategory, onJumpDone]);

  const locationInfo = LOCATION_PRODUCT_MAP[location.type];
  const availableCategories = locationInfo?.categories || [];

  // Filter products by location type
  const locationFiltered = PRODUCTS.filter(p =>
    location.type === "nearby"
      ? true  // show all for nearby
      : availableCategories.includes(p.category)
  );

  const CATEGORIES = ["All", ...new Set(locationFiltered.map(p => p.category))];

  const byCategory = (cat) => locationFiltered.filter(p => p.category === cat);

  const ROWS = [
    { label: "✦ Signature & Luxe",       products: [...byCategory("Signature Cakes"), ...byCategory("Luxe Collection")], dir: 1  },
    { label: "✦ Viennoiserie & Pastries", products: [...byCategory("Viennoiserie"),    ...byCategory("Cupcakes")],        dir: -1 },
    { label: "✦ Cookies & Brownies",     products: [...byCategory("Cookies"),          ...byCategory("Brownies")],        dir: 1  },
    { label: "✦ Breads & Donuts",        products: [...byCategory("Breads"),           ...byCategory("Donuts")],          dir: -1 },
    { label: "✦ International & Tea",    products: [...byCategory("International"),    ...byCategory("Tea Cakes")],       dir: 1  },
  ];

  const filtered = (() => {
    let list = activeCategory === "All"
      ? locationFiltered
      : locationFiltered.filter(p => p.category === activeCategory);

    // price range filter
    const mn = minPrice !== "" ? Number(minPrice) : null;
    const mx = maxPrice !== "" ? Number(maxPrice) : null;
    if (mn !== null) list = list.filter(p => p.priceINR >= mn);
    if (mx !== null) list = list.filter(p => p.priceINR <= mx);

    // sort
    if (sortBy === "Price: Low to High")  list = [...list].sort((a, b) => a.priceINR - b.priceINR);
    if (sortBy === "Price: High to Low")  list = [...list].sort((a, b) => b.priceINR - a.priceINR);
    if (sortBy === "Bestseller")          list = [...list].sort((a, b) => (a.tag === "Bestseller" ? -1 : 1));
    if (sortBy === "Newest")              list = [...list].sort((a, b) => b.id - a.id);

    return list;
  })();

  return (
    <section id="collection" className="py-10 sm:py-14 md:py-28 overflow-hidden"
      style={{ background: "linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)" }}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-12">

        {/* ── Cinematic Header ── */}
        <div ref={headRef} className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-[10px] uppercase tracking-[0.5em] mb-4"
                style={{ color: "rgba(212,168,67,0.55)" }}>
                {locationFiltered.length} Products · {location.flag} {location.city} · {locationInfo?.badge}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-6xl font-light text-white leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                The Signature
                <br />
                <em className="font-bold italic" style={{
                  background: "linear-gradient(135deg,#C9973A,#F0CC6E,#8B6914)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  backgroundSize: "200%",
                  animation: "morphGold 4s ease infinite",
                }}>{t.collectionSub}</em>
              </motion.h2>
            </div>

            {/* Currency toggle */}
            <motion.div
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col gap-3 self-start md:self-auto">
              {/* Currency + Sort row */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1 p-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {["INR","USD"].map(c => (
                    <motion.button key={c} onClick={() => setCurrency(c)} whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300"
                      style={currency === c
                        ? { background: "linear-gradient(135deg,#C9973A,#8B6914)", color: "#0a0800" }
                        : { color: "rgba(255,255,255,0.35)" }}>
                      {c === "INR" ? "₹ INR" : "$ USD"}
                    </motion.button>
                  ))}
                </div>
                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-xs font-semibold px-3 py-2 rounded-full outline-none cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(212,168,67,0.35)",
                    color: "rgba(255,255,255,0.7)",
                    appearance: "none",
                    WebkitAppearance: "none",
                    paddingRight: "2rem",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23D4A843' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.6rem center",
                  }}>
                  {["Default","Price: Low to High","Price: High to Low","Bestseller","Newest"].map(opt => (
                    <option key={opt} value={opt} style={{ background: "#1a1208", color: "#fff" }}>{opt}</option>
                  ))}
                </select>
              </div>
              {/* Price range filter */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(212,168,67,0.55)" }}>₹ Range</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  className="w-20 text-xs px-2 py-1.5 rounded-lg outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(212,168,67,0.25)",
                    color: "rgba(255,255,255,0.75)",
                    MozAppearance: "textfield",
                  }}
                />
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="w-20 text-xs px-2 py-1.5 rounded-lg outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(212,168,67,0.25)",
                    color: "rgba(255,255,255,0.75)",
                    MozAppearance: "textfield",
                  }}
                />
                {(minPrice || maxPrice) && (
                  <button
                    onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                    className="text-[10px] px-2 py-1 rounded-full"
                    style={{ color: "rgba(212,168,67,0.7)", border: "1px solid rgba(212,168,67,0.25)" }}>
                    ✕
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Category filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <motion.button key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="shrink-0 px-4 py-2 rounded-full text-[10px] font-semibold uppercase tracking-widest transition-all duration-300"
                style={activeCategory === cat
                  ? { background: "linear-gradient(135deg,#C9973A,#8B6914)", color: "#0a0800" }
                  : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {cat === "All" ? t.collectionAll : cat}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* ── Filtered grid (when category selected) ── */}
        {activeCategory !== "All" ? (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-16">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} currency={currency} index={i} onProductClick={onProductClick} />
            ))}
          </motion.div>
        ) : (
          /* ── Auto-scroll rows (All view) ── */
          ROWS.map((row, i) => (
            <ScrollRow key={i} products={row.products} currency={currency}
              label={row.label} direction={row.dir} onProductClick={onProductClick} />
          ))
        )}

        {/* ── 4 Feature points ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[
            { icon:"🎂", title: t.collectionBirthday,  sub: t.collectionBirthdaySub  },
            { icon:"🚚", title: t.collectionDelivery,  sub: t.collectionDeliverySub  },
            { icon:"🎁", title: t.collectionBuy5,      sub: t.collectionBuy5Sub      },
            { icon:"👑", title: t.collectionMember,    sub: t.collectionMemberSub    },
          ].map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              whileHover={{ y: -5, borderColor: "rgba(212,168,67,0.3)" }}
              className="rounded-2xl p-6 transition-all duration-500 cursor-default"
              style={{ background: "rgba(42,33,24,0.03)", border: "1px solid rgba(212,168,67,0.08)" }}>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-2xl mb-3">{f.icon}
              </motion.div>
              <p className="text-sm font-semibold mb-1"
                style={{ fontFamily: "'Playfair Display', serif", color: "var(--ivory)" }}>{f.title}</p>
              <p className="text-[11px]" style={{ color: "var(--ivory3)" }}>{f.sub}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
