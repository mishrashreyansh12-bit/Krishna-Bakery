import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

const SLIDES = [
  { url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=95&w=2400", title: "Artisan Cakes",     sub: "Crafted with love"  },
  { url: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&q=95&w=2400", title: "Premium Pastries", sub: "Baked at dawn"      },
  { url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=95&w=2400",    title: "Butter Cookies",  sub: "Crisp & golden"     },
  { url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=95&w=2400",    title: "Glazed Donuts",   sub: "Soft & indulgent"   },
  { url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=95&w=2400", title: "Tea Cakes",       sub: "Light & pure"       },
  { url: "https://images.unsplash.com/photo-1607478900766-efe13248b125?auto=format&fit=crop&q=95&w=2400", title: "Cupcakes",        sub: "Frosted perfection" },
];

// ── Floating flour/smoke particle ───────────────────────────────────────────
function Particle({ x, size, duration, delay, opacity }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        bottom: "-20px",
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(255,248,220,${opacity}), transparent 70%)`,
        filter: "blur(1px)",
      }}
      animate={{ y: [0, -180, -320], opacity: [0, opacity * 1.4, 0], x: [0, Math.random() > 0.5 ? 20 : -20, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x:        Math.random() * 100,
  size:     `${3 + Math.random() * 6}px`,
  duration: 5 + Math.random() * 7,
  delay:    Math.random() * 8,
  opacity:  0.15 + Math.random() * 0.25,
}));

export default function Hero({ onOrderClick }) {
  const [slide, setSlide] = useState(0);
  const heroRef    = useRef(null);
  const contentRef = useRef(null);
  const cursorRef  = useRef(null);
  const cursorDotRef = useRef(null);
  const bgRef      = useRef(null);

  // scroll
  const { scrollY } = useScroll();
  const rawBgY  = useTransform(scrollY, [0, 700], [0, 130]);
  const rawFade = useTransform(scrollY, [0, 500], [1, 0]);
  const bgY     = useSpring(rawBgY,  { stiffness: 50, damping: 18 });
  const fadeOut = useSpring(rawFade, { stiffness: 70, damping: 22 });

  // ── Luxury dual cursor ─────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX - 20, y: e.clientY - 20,
        duration: 0.55, ease: "power3.out",
      });
      gsap.to(cursorDotRef.current, {
        x: e.clientX - 3, y: e.clientY - 3,
        duration: 0.12, ease: "none",
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ── Mouse parallax depth ───────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      const { innerWidth: W, innerHeight: H } = window;
      const dx = (e.clientX / W - 0.5) * 2;
      const dy = (e.clientY / H - 0.5) * 2;

      // content layer — moves forward
      gsap.to(contentRef.current, {
        x: dx * 22, y: dy * 12,
        rotateY: dx * 4, rotateX: -dy * 2.5,
        duration: 1.4, ease: "power2.out",
        transformPerspective: 1400,
      });
      // bg layer — moves backward (depth)
      gsap.to(bgRef.current, {
        x: dx * -35, y: dy * -18,
        duration: 2, ease: "power2.out",
      });
    };
    const el = heroRef.current;
    el?.addEventListener("mousemove", onMove);
    return () => el?.removeEventListener("mousemove", onMove);
  }, []);

  // ── GSAP cinematic entrance — handled by index.js on load ────────────────
  // (triggerPageEntrance in index.js fires after loader removes)

  // ── Auto slide ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden bg-[#060402]"
      style={{ cursor: "none" }}>

      {/* ── Dual luxury cursor ── */}
      <div ref={cursorRef} className="fixed z-[9999] pointer-events-none mix-blend-difference"
        style={{ top: 0, left: 0, width: 40, height: 40 }}>
        <motion.div className="w-full h-full rounded-full border"
          style={{ borderColor: "rgba(212,168,67,0.7)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div ref={cursorDotRef} className="fixed z-[9999] pointer-events-none"
        style={{ top: 0, left: 0, width: 6, height: 6, background: "#D4A843", borderRadius: "50%" }}
      />

      {/* ── Background ── */}
      <motion.div ref={bgRef} className="absolute inset-0 scale-110" style={{ y: bgY }}>
        {SLIDES.map((s, i) => (
          <motion.div key={i} className="absolute inset-0"
            animate={{ opacity: i === slide ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}>
            <img src={s.url} alt={s.title} className="w-full h-full object-cover"
              style={{ transform: i === slide ? "scale(1.05)" : "scale(1)", transition: "transform 7s ease-out" }}
            />
          </motion.div>
        ))}

        {/* gradient layers */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(115deg, rgba(4,3,1,0.9) 0%, rgba(4,3,1,0.45) 50%, rgba(4,3,1,0.65) 100%)" }}/>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(4,3,1,0.4) 0%, transparent 30%, rgba(4,3,1,0.95) 100%)" }}/>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(4,3,1,0.6) 100%)" }}/>

        {/* ambient gold glow */}
        <motion.div className="absolute pointer-events-none"
          style={{ width: "60%", height: "60%", top: "20%", left: "30%",
            background: "radial-gradient(ellipse, rgba(212,168,67,0.04) 0%, transparent 70%)",
            filter: "blur(40px)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* film grain */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
        />
      </motion.div>

      {/* ── Flour/smoke particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}
      </div>

      {/* ── Ambient corner light ── */}
      <div className="absolute top-0 left-0 w-96 h-96 pointer-events-none z-10"
        style={{ background: "radial-gradient(ellipse at top left, rgba(212,168,67,0.06) 0%, transparent 70%)" }}
      />

      {/* ── Main content ── */}
      <motion.div style={{ opacity: fadeOut }}
        className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16 lg:px-28 max-w-screen-xl mx-auto">

        <div ref={contentRef} style={{ transformStyle: "preserve-3d" }}>

          {/* eyebrow */}
          <div className="h-eyebrow flex items-center gap-4 mb-8" style={{ opacity: 0 }}>
            <motion.div className="h-px w-14"
              style={{ background: "linear-gradient(to right, transparent, rgba(212,168,67,0.7))" }}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <span className="text-[10px] uppercase tracking-[0.55em] font-medium"
              style={{ color: "rgba(212,168,67,0.6)" }}>
              Est. 2026 · Artisan Bakery · India
            </span>
          </div>

          {/* headline */}
          <div className="overflow-hidden mb-1">
            <h1 className="h-line1 text-[clamp(3.8rem,10.5vw,9.5rem)] font-light leading-[0.86] text-white"
              style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.03em", opacity: 0 }}>
              Art of
            </h1>
          </div>
          <div className="overflow-hidden mb-9">
            <h1 className="h-line2 text-[clamp(3.8rem,10.5vw,9.5rem)] font-bold leading-[0.86] italic"
              style={{
                fontFamily: "'Playfair Display', serif",
                letterSpacing: "-0.03em", opacity: 0,
                background: "linear-gradient(135deg, #B8832A 0%, #F0CC6E 45%, #9A6E18 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
              the Bake
            </h1>
          </div>

          {/* desc */}
          <p className="h-desc text-sm md:text-[15px] font-light max-w-xs mb-10 leading-[1.8]"
            style={{ color: "rgba(255,255,255,0.42)", opacity: 0, letterSpacing: "0.01em" }}>
            Premium desserts crafted with intention —<br />
            for those who taste the difference.
          </p>

          {/* CTAs */}
          <div className="h-cta flex items-center gap-6" style={{ opacity: 0 }}>
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: "0 0 70px rgba(212,168,67,0.3), 0 0 140px rgba(212,168,67,0.1)" }}
              whileTap={{ scale: 0.94 }}
              onClick={onOrderClick}
              className="relative group px-9 py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.25em] overflow-hidden"
              style={{ background: "linear-gradient(135deg, #C9973A, #8B6914)", color: "#0a0800" }}
            >
              <motion.span className="absolute inset-0 -skew-x-12"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                animate={{ x: ["-120%", "220%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
              />
              <span className="relative">Order Now</span>
            </motion.button>

            <motion.a href="#collection"
              whileHover={{ x: 6, color: "rgba(212,168,67,0.8)" }}
              className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.25em] transition-colors duration-300"
              style={{ color: "rgba(255,255,255,0.38)" }}>
              Explore Menu
              <motion.svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </motion.svg>
            </motion.a>
          </div>

          {/* stats */}
          <div className="flex items-center gap-10 mt-16 pt-10"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {[["500+","Customers"],["50+","Items"],["4.9★","Rating"],["6+","Years"]].map(([n,l]) => (
              <div key={l} className="h-stat" style={{ opacity: 0 }}>
                <p className="text-xl font-bold" style={{
                  background: "linear-gradient(135deg,#D4A843,#F5D78E)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
                }}>{n}</p>
                <p className="text-[9px] uppercase tracking-widest mt-1"
                  style={{ color: "rgba(255,255,255,0.25)" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Right slide selector ── */}
      <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-end gap-6">
        {SLIDES.map((s, i) => (
          <motion.button key={i} onClick={() => setSlide(i)}
            animate={{ opacity: i === slide ? 1 : 0.2 }}
            whileHover={{ opacity: 0.6 }}
            className="flex items-center gap-3">
            <AnimatePresence>
              {i === slide && (
                <motion.div className="text-right"
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.4 }}>
                  <p className="text-[11px] font-semibold text-white tracking-wide">{s.title}</p>
                  <p className="text-[9px] mt-0.5" style={{ color: "rgba(212,168,67,0.5)" }}>{s.sub}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div className="w-px rounded-full"
              animate={{ height: i === slide ? 40 : 14, background: i === slide ? "#D4A843" : "rgba(255,255,255,0.15)" }}
              transition={{ duration: 0.4 }}
            />
          </motion.button>
        ))}
      </div>

      {/* ── Bottom dots ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
        {SLIDES.map((_, i) => (
          <motion.button key={i} onClick={() => setSlide(i)}
            animate={{ width: i === slide ? 32 : 6, opacity: i === slide ? 1 : 0.25 }}
            transition={{ duration: 0.4 }}
            className="h-[3px] rounded-full"
            style={{ background: i === slide ? "#D4A843" : "rgba(255,255,255,0.5)" }}
          />
        ))}
      </div>

      {/* ── Scroll mouse indicator ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}
        className="absolute bottom-9 right-10 z-20 hidden md:flex flex-col items-center gap-2">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
          className="w-[18px] h-[30px] rounded-full border flex items-start justify-center pt-[5px]"
          style={{ borderColor: "rgba(255,255,255,0.12)" }}>
          <div className="w-[2px] h-[7px] rounded-full" style={{ background: "#D4A843" }}/>
        </motion.div>
      </motion.div>

    </section>
  );
}
