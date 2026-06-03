import { useState, useEffect, useRef } from "react";
import LocationMenu from "./LocationMenu";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, TRANSLATIONS } from "../context/LocationContext";
import UserAccountDrawer from "./UserAccountDrawer";

export default function Navbar({ onOrderClick, onLoginClick, user, onLogout, onCategoryClick }) {
  const { lang } = useLocation();
  const t = TRANSLATIONS[lang] || TRANSLATIONS["en"];
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [activeMenu,  setActiveMenu]  = useState(null);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const closeTimer = useRef(null);

  const NAV_ITEMS = [
    {
      label: t.navCollections, href: "#collection",
      mega: [
        { icon: "🎂", label: "Signature Cakes",   sub: "Belgian, Red Velvet, Tiramisu" },
        { icon: "👑", label: "Luxe Collection",   sub: "Opera, Entremet, Mousse" },
        { icon: "🥐", label: "Viennoiserie",      sub: "Croissant, Eclair, Mille Feuille" },
        { icon: "🍩", label: "Donuts & Cupcakes", sub: "Glazed, Sprinkle, Velvet" },
        { icon: "🍫", label: "Brownies",          sub: "Fudge, Walnut, Caramel" },
        { icon: "🍞", label: "Breads",            sub: "Sourdough, Brioche, Focaccia" },
        { icon: "🍪", label: "Cookies",           sub: "NY Style, Belgian Butter, Matcha" },
        { icon: "🌍", label: "International",     sub: "Macarons, Baklava, Churros" },
      ],
    },
    {
      label: t.navAI, href: "#ai-customizer",
      mega: [
        { icon: "✨", label: "Dream Dessert",   sub: "Mood → perfect cake suggestion" },
        { icon: "🎨", label: "Custom Flavours", sub: "Build your own signature cake" },
        { icon: "🎁", label: "Gift Builder",    sub: "Build the perfect gift box" },
      ],
    },
    {
      label: t.navStory, href: "#our-story",
      mega: [
        { icon: "🔥", label: "Est. 2019",     sub: "One oven, two bakers, one dream" },
        { icon: "📍", label: "20+ Outlets",   sub: "Delhi, Noida, Jaipur & more" },
        { icon: "🏆", label: "Award Winning", sub: "Regional Bakery Award 2023" },
        { icon: "👨‍🍳", label: "Our Bakers",   sub: "3-month trained artisans" },
      ],
    },
    {
      label: t.navReviews, href: "#reviews",
      mega: [
        { icon: "⭐", label: "4.8 Rating",      sub: "1,240+ verified reviews" },
        { icon: "📸", label: "Customer Reels",  sub: "Real unboxing videos" },
        { icon: "✍️", label: "Write a Review",  sub: "Share your experience" },
      ],
    },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  function openMenu(label) { clearTimeout(closeTimer.current); setActiveMenu(label); }
  function closeMenu() { closeTimer.current = setTimeout(() => setActiveMenu(null), 120); }

  // wishlist count from localStorage
  const wishlistCount = (() => {
    try { return JSON.parse(localStorage.getItem("kb_wishlist") || "[]").length; } catch { return 0; }
  })();

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed z-50 transition-all duration-500"
        style={{
          top: scrolled ? "10px" : "0",
          left: scrolled ? "16px" : "0",
          right: scrolled ? "16px" : "0",
          borderRadius: scrolled ? "20px" : "0",
          background: scrolled ? "rgba(14,11,7,0.96)" : "rgba(14,11,7,0.6)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: scrolled ? "1px solid rgba(212,168,67,0.14)" : "none",
          boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,168,67,0.06)" : "none",
        }}
      >
        <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-3">

          {/* ── Logo ── */}
          <motion.a href="/" whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 no-underline shrink-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black shadow-lg"
              style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800", boxShadow: "0 4px 12px rgba(212,168,67,0.3)" }}>
              KB
            </div>
            <div className="hidden sm:block leading-none">
              <p className="text-white font-bold text-sm tracking-tight">Krishna <span style={{
                background: "linear-gradient(135deg,#D4A843,#F5D78E)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>Bakers</span></p>
              <p className="text-[8px] uppercase tracking-[0.2em] mt-0.5" style={{ color: "rgba(212,168,67,0.4)" }}>Est. 2019 · Artisan</p>
            </div>
          </motion.a>

          {/* ── Desktop nav links ── */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative"
                onMouseEnter={() => openMenu(item.label)}
                onMouseLeave={closeMenu}>
                <motion.a href={item.href}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-widest transition-all"
                  style={{ color: activeMenu === item.label ? "#D4A843" : "rgba(242,232,217,0.5)" }}>
                  {item.label}
                  <motion.svg animate={{ rotate: activeMenu === item.label ? 180 : 0 }} transition={{ duration: 0.2 }}
                    className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </motion.svg>
                </motion.a>

                <AnimatePresence>
                  {activeMenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      onMouseEnter={() => openMenu(item.label)}
                      onMouseLeave={closeMenu}
                      className="absolute top-full left-0 mt-2 rounded-2xl overflow-hidden"
                      style={{
                        minWidth: item.mega.length > 4 ? "min(400px, 90vw)" : "min(250px, 90vw)",
                        background: "rgba(14,11,7,0.98)",
                        border: "1px solid rgba(212,168,67,0.14)",
                        backdropFilter: "blur(24px)",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,168,67,0.06)",
                      }}
                    >
                      <div className={`p-2.5 grid gap-0.5 ${item.mega.length > 4 ? "grid-cols-2" : "grid-cols-1"}`}>
                        {item.mega.map((m) => (
                          <motion.a key={m.label} href={item.href}
                            whileHover={{ background: "rgba(212,168,67,0.07)", x: 2 }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all no-underline">
                            <span className="text-lg shrink-0">{m.icon}</span>
                            <div>
                              <p className="text-[11px] font-semibold" style={{ color: "var(--ivory)" }}>{m.label}</p>
                              <p className="text-[9px] mt-0.5" style={{ color: "rgba(242,232,217,0.35)" }}>{m.sub}</p>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                      <div className="h-px mx-3 mb-2.5" style={{ background: "linear-gradient(to right, transparent, rgba(212,168,67,0.15), transparent)" }}/>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* ── Right side: compact icon group ── */}
          <div className="flex items-center gap-1.5">

            {/* Location */}
            <LocationMenu onCategoryClick={onCategoryClick} />

            {/* ── Icon group (desktop only) ── */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>

              {/* Search */}
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all group"
                style={{ color: "rgba(242,232,217,0.45)" }} title="Browse Menu">
                <svg className="w-3.5 h-3.5 group-hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </motion.button>

              {/* Wishlist */}
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all relative group"
                style={{ color: "rgba(242,232,217,0.45)" }} title="Wishlist">
                <svg className="w-3.5 h-3.5 group-hover:text-amber-400 transition-colors" fill={wishlistCount > 0 ? "#D4A843" : "none"} stroke={wishlistCount > 0 ? "#D4A843" : "currentColor"} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center"
                    style={{ background: "#D4A843", color: "#0a0800" }}>{wishlistCount}</span>
                )}
              </motion.button>

              {/* Cart */}
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={onOrderClick}
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all group"
                style={{ color: "rgba(212,168,67,0.7)" }} title="Order">
                <svg className="w-3.5 h-3.5 group-hover:text-amber-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </motion.button>

              {/* Divider */}
              <div className="w-px h-5 mx-0.5" style={{ background: "rgba(255,255,255,0.08)" }}/>

              {/* Account / 3-line */}
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setAccountOpen(true)}
                className="w-8 h-8 rounded-xl flex flex-col items-center justify-center gap-[3px] transition-all group"
                style={{ color: "rgba(212,168,67,0.7)" }} title="My Account">
                <span className="block w-3.5 h-[1.5px] rounded-full transition-colors"
                  style={{ background: "rgba(212,168,67,0.7)" }}/>
                <span className="block w-2.5 h-[1.5px] rounded-full"
                  style={{ background: "rgba(212,168,67,0.5)" }}/>
                <span className="block w-3.5 h-[1.5px] rounded-full"
                  style={{ background: "rgba(212,168,67,0.7)" }}/>
              </motion.button>
            </div>

            {/* User pill (desktop) — only when logged in */}
            {user && (
              <motion.div whileHover={{ scale: 1.02 }}
                className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-full cursor-pointer"
                style={{ background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.15)" }}
                onClick={() => setAccountOpen(true)}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}>
                  {(user.user_metadata?.full_name || user.email || "U")[0].toUpperCase()}
                </div>
                <span className="text-[10px] font-medium max-w-[80px] truncate" style={{ color: "rgba(212,168,67,0.8)" }}>
                  {user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
                </span>
              </motion.div>
            )}

            {/* Order CTA — primary gold button */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(212,168,67,0.3)" }}
              whileTap={{ scale: 0.97 }}
              onClick={onOrderClick}
              className="hidden md:block text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-full relative overflow-hidden"
              style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}
            >
              <motion.span className="absolute inset-0 -skew-x-12 pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
              />
              <span className="relative">{t.orderOnline}</span>
            </motion.button>

            {/* Mobile: hamburger only */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.05)" }}>
              <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 8 : 0 }}
                className="block w-5 h-0.5 rounded-full" style={{ background: "var(--ivory)" }}/>
              <motion.span animate={{ opacity: mobileOpen ? 0 : 1 }}
                className="block w-5 h-0.5 rounded-full" style={{ background: "var(--ivory)" }}/>
              <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -8 : 0 }}
                className="block w-5 h-0.5 rounded-full" style={{ background: "var(--ivory)" }}/>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[68px] left-3 right-3 z-40 rounded-2xl overflow-hidden"
            style={{ background: "rgba(14,11,7,0.98)", border: "1px solid rgba(212,168,67,0.12)", backdropFilter: "blur(24px)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
          >
            <div className="p-3 space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl transition-all no-underline"
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(212,168,67,0.07)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span className="text-sm font-medium" style={{ color: "var(--ivory)" }}>{item.label}</span>
                  <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              ))}
              <div className="pt-2 mt-1 border-t space-y-1.5" style={{ borderColor: "rgba(212,168,67,0.08)" }}>
                <div className="flex gap-2">
                  <button onClick={() => { setAccountOpen(true); setMobileOpen(false); }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition"
                    style={{ background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.15)", color: "rgba(212,168,67,0.8)" }}>
                    👤 My Account
                  </button>
                  {!user && (
                    <button onClick={() => { onLoginClick(); setMobileOpen(false); }}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition"
                      style={{ border: "1px solid rgba(212,168,67,0.2)", color: "rgba(212,168,67,0.6)" }}>
                      {t.login}
                    </button>
                  )}
                </div>
                <button onClick={() => { onOrderClick(); setMobileOpen(false); }}
                  className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-widest"
                  style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}>
                  {t.orderOnline}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── User Account Drawer ── */}
      <UserAccountDrawer
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        user={user}
        onLoginClick={onLoginClick}
        onOrderClick={(type) => {
          setAccountOpen(false);
          onOrderClick();
        }}
      />
    </>
  );
}
