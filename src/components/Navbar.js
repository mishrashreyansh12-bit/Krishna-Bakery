import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar({ onOrderClick, onLoginClick, user, onLogout }) {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Collections", href: "#collection" },
    { label: "AI Customizer", href: "#ai-customizer" },
    { label: "Our Story", href: "#our-story" },
    { label: "Reviews", href: "#reviews" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed z-50 transition-all duration-500 ${
          scrolled
            ? "top-3 left-4 right-4 md:left-8 md:right-8 rounded-2xl shadow-2xl"
            : "top-0 left-0 right-0 rounded-none"
        }`}
        style={{
          background: scrolled
            ? "rgba(13, 11, 8, 0.85)"
            : "rgba(13, 11, 8, 0.3)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: scrolled ? "1px solid rgba(212,168,67,0.15)" : "none",
        }}
      >
        <div className="px-6 md:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #D4A843, #8B6914)" }}>
              KB
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Krishna <span className="gold-text">Bakers</span>
            </span>
          </motion.div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <motion.a
                key={l.label}
                href={l.href}
                whileHover={{ y: -1 }}
                className="text-xs font-medium uppercase tracking-widest text-white/70 hover:text-amber-400 transition-colors duration-200"
              >
                {l.label}
              </motion.a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-xs text-white/60">
                  Hi, {user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
                </span>
                <button
                  onClick={onLogout}
                  className="text-xs text-white/50 hover:text-white transition border border-white/10 px-3 py-1.5 rounded-full"
                >
                  Logout
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onLoginClick}
                className="hidden md:block text-xs font-medium text-white/70 hover:text-amber-400 transition border border-white/10 hover:border-amber-400/30 px-4 py-2 rounded-full"
              >
                Login
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOrderClick}
              className="text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #D4A843, #8B6914)", color: "#0D0B08" }}
            >
              Order Online
            </motion.button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-1"
            >
              <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 z-40 rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "rgba(13,11,8,0.95)", border: "1px solid rgba(212,168,67,0.15)", backdropFilter: "blur(24px)" }}
          >
            {links.map((l) => (
              <a key={l.label} href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-widest text-white/70 hover:text-amber-400 transition py-1 border-b border-white/5">
                {l.label}
              </a>
            ))}
            {!user && (
              <button onClick={() => { onLoginClick(); setMenuOpen(false); }}
                className="text-sm text-amber-400 font-medium text-left py-1">
                Login / Register
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
