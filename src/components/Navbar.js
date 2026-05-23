import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  {
    label: "Collections",
    href: "#collection",
    mega: [
      { icon: "🎂", label: "Signature Cakes",  sub: "Belgian, Red Velvet, Tiramisu" },
      { icon: "👑", label: "Luxe Collection",  sub: "Opera, Entremet, Mousse" },
      { icon: "🥐", label: "Viennoiserie",     sub: "Croissant, Eclair, Mille Feuille" },
      { icon: "🍩", label: "Donuts & Cupcakes",sub: "Glazed, Sprinkle, Velvet" },
      { icon: "🍫", label: "Brownies",         sub: "Fudge, Walnut, Caramel" },
      { icon: "🍞", label: "Breads",           sub: "Sourdough, Brioche, Focaccia" },
      { icon: "🍪", label: "Cookies",          sub: "NY Style, Belgian Butter, Matcha" },
      { icon: "🌍", label: "International",    sub: "Macarons, Baklava, Churros" },
    ],
  },
  {
    label: "AI Customizer",
    href: "#ai-customizer",
    mega: [
      { icon: "✨", label: "Dream Dessert",    sub: "Describe your mood, get a recipe" },
      { icon: "🎨", label: "Custom Flavours",  sub: "Summer, Winter, Romantic, Cozy" },
      { icon: "🎁", label: "Gift Builder",     sub: "Build the perfect gift box" },
    ],
  },
  {
    label: "Our Story",
    href: "#our-story",
    mega: [
      { icon: "🔥", label: "Est. 2019",        sub: "One oven, two bakers, one dream" },
      { icon: "📍", label: "20+ Outlets",      sub: "Delhi, Noida, Jaipur & more" },
      { icon: "🏆", label: "Award Winning",    sub: "Regional Bakery Award 2023" },
      { icon: "👨‍🍳", label: "Our Bakers",      sub: "3-month trained artisans" },
    ],
  },
  {
    label: "Reviews",
    href: "#reviews",
    mega: [
      { icon: "⭐", label: "4.8 Rating",       sub: "1,240+ verified reviews" },
      { icon: "📸", label: "Customer Reels",   sub: "Real unboxing videos" },
      { icon: "✍️", label: "Write a Review",   sub: "Share your experience" },
    ],
  },
];

export default function Navbar({ onOrderClick, onLoginClick, user, onLogout }) {
  const [scrolled,    setScrolled]    = useState(false);
  const [activeMenu,  setActiveMenu]  = useState(null);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  function openMenu(label)  {
    clearTimeout(closeTimer.current);
    setActiveMenu(label);
  }
  function closeMenu() {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  }

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
          background: scrolled ? "rgba(28,22,18,0.95)" : "rgba(28,22,18,0.5)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: scrolled ? "1px solid rgba(212,168,67,0.12)" : "none",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div className="px-5 md:px-8 py-3.5 flex items-center justify-between">

          {/* Logo */}
          <motion.a href="/" whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black"
              style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}>
              KB
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-bold text-sm tracking-tight">Krishna </span>
              <span className="text-sm font-bold tracking-tight" style={{
                background: "linear-gradient(135deg,#D4A843,#F5D78E)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>Bakers</span>
            </div>
          </motion.a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative"
                onMouseEnter={() => openMenu(item.label)}
                onMouseLeave={closeMenu}>
                <motion.a
                  href={item.href}
                  whileHover={{ color: "#D4A843" }}
                  className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-[11px] font-medium uppercase tracking-widest transition-colors duration-200"
                  style={{ color: activeMenu === item.label ? "var(--gold)" : "rgba(242,232,217,0.55)" }}
                >
                  {item.label}
                  <motion.svg
                    animate={{ rotate: activeMenu === item.label ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </motion.svg>
                </motion.a>

                {/* Dropdown */}
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
                        minWidth: item.mega.length > 4 ? "420px" : "260px",
                        background: "rgba(28,22,18,0.98)",
                        border: "1px solid rgba(212,168,67,0.12)",
                        backdropFilter: "blur(24px)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                      }}
                    >
                      <div className={`p-3 grid gap-1 ${item.mega.length > 4 ? "grid-cols-2" : "grid-cols-1"}`}>
                        {item.mega.map((m) => (
                          <motion.a
                            key={m.label}
                            href={item.href}
                            whileHover={{ background: "rgba(212,168,67,0.07)", x: 2 }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 no-underline"
                          >
                            <span className="text-xl shrink-0">{m.icon}</span>
                            <div>
                              <p className="text-[12px] font-semibold leading-tight" style={{ color: "var(--ivory)" }}>{m.label}</p>
                              <p className="text-[10px] mt-0.5" style={{ color: "var(--ivory3)" }}>{m.sub}</p>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                      {/* bottom gold line */}
                      <div className="h-px mx-3 mb-3" style={{ background: "linear-gradient(to right, transparent, rgba(212,168,67,0.2), transparent)" }}/>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.15)" }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}>
                    {(user.user_metadata?.full_name || user.email || "U")[0].toUpperCase()}
                  </div>
                  <span className="text-[11px] font-medium" style={{ color: "rgba(212,168,67,0.8)" }}>
                    {user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
                  </span>
                </div>
                <button onClick={onLogout}
                  className="text-[10px] px-3 py-1.5 rounded-full transition"
                  style={{ color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.6)"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}>
                  Logout
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onLoginClick}
                className="hidden md:block text-[10px] font-medium uppercase tracking-widest px-4 py-2 rounded-full transition-all"
                style={{ color: "rgba(242,232,217,0.4)", border: "1px solid rgba(242,232,217,0.1)" }}
              >
                Login
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(212,168,67,0.25)" }}
              whileTap={{ scale: 0.96 }}
              onClick={onOrderClick}
              className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full"
              style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}
            >
              Order Online
            </motion.button>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 p-1.5 ml-1">
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

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-3 right-3 z-40 rounded-2xl overflow-hidden"
            style={{ background: "rgba(28,22,18,0.98)", border: "1px solid rgba(212,168,67,0.12)", backdropFilter: "blur(24px)" }}
          >
            <div className="p-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <a key={item.label} href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl transition-all no-underline"
                  style={{ color: "var(--ivory2)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(212,168,67,0.07)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span className="text-sm font-medium" style={{ color: "var(--ivory)" }}>{item.label}</span>
                  <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              ))}
              <div className="pt-2 border-t" style={{ borderColor: "rgba(212,168,67,0.1)" }}>
                {!user && (
                  <button onClick={() => { onLoginClick(); setMobileOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                    style={{ color: "var(--gold)" }}>
                    Login / Register
                  </button>
                )}
                <button onClick={() => { onOrderClick(); setMobileOpen(false); }}
                  className="w-full mt-1 py-3 rounded-xl text-sm font-bold uppercase tracking-widest"
                  style={{ background: "linear-gradient(135deg,#D4A843,#8B6914)", color: "#0a0800" }}>
                  Order Online
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
