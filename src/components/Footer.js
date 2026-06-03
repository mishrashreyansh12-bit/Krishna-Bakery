import { motion } from "framer-motion";
import { useLocation, TRANSLATIONS } from "../context/LocationContext";

function Footer() {
  const { lang } = useLocation();
  const t = TRANSLATIONS[lang] || TRANSLATIONS["en"];
  return (
    <footer style={{ background: "var(--bg3)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #D4A843, #8B6914)" }}>
                KB
              </div>
              <span className="text-lg font-bold text-white">
                Krishna <span className="gold-text">Bakers</span>
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Handcrafted premium desserts made with love and the finest ingredients. Est. 2026.
            </p>
            <div className="flex gap-3 mt-5">
              {["📸", "📘", "🐦"].map((icon, i) => (
                <motion.button key={i} whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                  style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.15)" }}>
                  {icon}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400/70 mb-5">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {["Collections", "AI Customizer", "Our Story", "Reviews", "Order Online"].map((l) => (
                <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`}
                  className="text-sm text-white/40 hover:text-amber-400 transition">
                  {l}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400/70 mb-5">Contact Us</h4>
            <div className="flex flex-col gap-3 text-sm text-white/40">
              <a href="https://wa.me/919131401594" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-green-400 transition">
                <span>📱</span> +91 91314 01594
              </a>
              <p className="flex items-center gap-2"><span>📍</span> Noida, Uttar Pradesh</p>
              <p className="flex items-center gap-2"><span>🕐</span> Open Daily · 8am – 9pm</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(212,168,67,0.08)" }}>
          <p className="text-xs text-white/20 uppercase tracking-widest">
            © 2026 Krishna Bakers · All rights reserved
          </p>
          <p className="text-xs text-white/20">
            Handcrafted with ❤️ for the modern palate
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
