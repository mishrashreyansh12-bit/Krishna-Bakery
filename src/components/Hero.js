import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";

// ── Premium cinematic bakery slides ─────────────────────────────────────────
const SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=95&w=2400",
    tag: "Signature Cakes",
    headline: ["Art of", "the Bake"],
    sub: "Belgian chocolate ganache, crafted to perfection.",
    accent: "#D4A843",
  },
  {
    url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=95&w=2400",
    tag: "Viennoiserie",
    headline: ["Baked at", "Dawn"],
    sub: "81 layers of laminated dough. Every morning, fresh.",
    accent: "#E8C060",
  },
  {
    url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=95&w=2400",
    tag: "Glazed Donuts",
    headline: ["Soft &", "Indulgent"],
    sub: "Mirror-glazed, pillowy soft. A daily ritual.",
    accent: "#F0CC6E",
  },
  {
    url: "https://images.unsplash.com/photo-1607478900766-efe13248b125?auto=format&fit=crop&q=95&w=2400",
    tag: "Cupcakes",
    headline: ["Frosted", "Perfection"],
    sub: "Tall swirl frosting on a moist vanilla sponge.",
    accent: "#D4A843",
  },
  {
    url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=95&w=2400",
    tag: "Fudge Brownies",
    headline: ["Dense &", "Fudgy"],
    sub: "Crinkle top, gooey centre. Our most loved item.",
    accent: "#C9973A",
  },
  {
    url: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=95&w=2400",
    tag: "French Macarons",
    headline: ["Parisian", "Elegance"],
    sub: "Delicate shells, seasonal fillings. Pure luxury.",
    accent: "#F0CC6E",
  },
];

export default function Hero({ onOrderClick }) {
  const [slide, setSlide] = useState(0);
  const [prev,  setPrev]  = useState(null);
  const [dir,   setDir]   = useState(1);
  const heroRef = useRef(null);
  const bgRef   = useRef(null);
  const mouse   = useRef({ x: 0, y: 0 });
  const ring    = useRef({ x: 0, y: 0 });

  const { scrollY } = useScroll();
  const bgY    = useTransform(scrollY, [0, 600], [0, 100]);
  const fadeOut = useTransform(scrollY, [0, 400], [1, 0]);

  // ── Mouse parallax ──────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      const { innerWidth: W, innerHeight: H } = window;
      const dx = (e.clientX / W - 0.5) * 2;
      const dy = (e.clientY / H - 0.5) * 2;
      if (bgRef.current) {
        gsap.to(bgRef.current, { x: dx * -25, y: dy * -12, duration: 1.8, ease: "power2.out" });
      }
    };
    const el = heroRef.current;
    el?.addEventListener("mousemove", onMove);
    return () => el?.removeEventListener("mousemove", onMove);
  }, []);

  // ── Auto advance ────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      setPrev(slide);
      setDir(1);
      setSlide(s => (s + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
  }, [slide]);

  // ── GSAP text entrance ──────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".h-eyebrow", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
      gsap.fromTo(".h-line1",   { y: 80, opacity: 0, skewY: 3 }, { y: 0, opacity: 1, skewY: 0, duration: 1.1, delay: 0.35, ease: "expo.out" });
      gsap.fromTo(".h-line2",   { y: 80, opacity: 0, skewY: 3 }, { y: 0, opacity: 1, skewY: 0, duration: 1.1, delay: 0.5,  ease: "expo.out" });
      gsap.fromTo(".h-desc",    { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 0.8, ease: "power3.out" });
      gsap.fromTo(".h-cta",     { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 0.95, ease: "power3.out" });
      gsap.fromTo(".h-stat",    { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 1.1, ease: "power3.out", stagger: 0.1 });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const current = SLIDES[slide];

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden"
      style={{ background: "var(--bg)", cursor: "none" }}>

      {/* ── Background image — right side contained ── */}
      <motion.div ref={bgRef} className="absolute inset-0">
        {/* left dark overlay */}
        <div className="absolute inset-0 z-10" style={{
          background: "linear-gradient(to right, var(--bg) 35%, rgba(28,22,18,0.7) 60%, rgba(28,22,18,0.2) 100%)"
        }}/>
        <div className="absolute inset-0 z-10" style={{
          background: "linear-gradient(to bottom, rgba(28,22,18,0.5) 0%, transparent 30%, rgba(28,22,18,0.9) 100%)"
        }}/>

        <AnimatePresence mode="sync">
          <motion.div key={slide} className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}>
            <img src={current.url} alt={current.tag}
              className="w-full h-full object-cover object-center"
              style={{ filter: "brightness(0.65) saturate(1.1)" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* gold ambient glow */}
        <motion.div className="absolute pointer-events-none z-10"
          style={{ width: "40%", height: "50%", top: "25%", right: "10%",
            background: "radial-gradient(ellipse, rgba(212,168,67,0.08) 0%, transparent 70%)",
            filter: "blur(50px)" }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ── Animated product reveal panel (right side) — REMOVED ── */}

      {/* ── Main content ── */}
      <motion.div style={{ opacity: fadeOut }}
        className="relative z-20 h-full flex flex-col justify-center px-8 md:px-14 lg:px-20 max-w-screen-xl mx-auto">

        {/* eyebrow */}
        <div className="h-eyebrow flex items-center gap-3 mb-7" style={{ opacity: 0 }}>
          <AnimatePresence mode="wait">
            <motion.span key={`tag-${slide}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-[10px] font-bold uppercase tracking-[0.5em] px-3 py-1.5 rounded-full"
              style={{ background: `${current.accent}18`, color: current.accent, border: `1px solid ${current.accent}30` }}>
              {current.tag}
            </motion.span>
          </AnimatePresence>
          <div className="h-px w-10" style={{ background: `linear-gradient(to right, ${current.accent}60, transparent)` }}/>
          <span className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "rgba(242,232,217,0.35)" }}>
            Est. 2019 · Artisan Bakery
          </span>
        </div>

        {/* headline */}
        <div className="overflow-hidden mb-1">
          <h1 className="h-line1 text-[clamp(3.5rem,9vw,8.5rem)] font-light leading-[0.88]"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.03em", opacity: 0, color: "var(--ivory)" }}>
            <AnimatePresence mode="wait">
              <motion.span key={`l1-${slide}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}>
                {current.headline[0]}
              </motion.span>
            </AnimatePresence>
          </h1>
        </div>
        <div className="overflow-hidden mb-8">
          <h1 className="h-line2 text-[clamp(3.5rem,9vw,8.5rem)] font-bold leading-[0.88] italic"
            style={{
              fontFamily: "'Playfair Display', serif",
              letterSpacing: "-0.03em", opacity: 0,
              background: "linear-gradient(135deg, #D4A843 0%, #F0CC6E 50%, #A67C1A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
            <AnimatePresence mode="wait">
              <motion.span key={`l2-${slide}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}>
                {current.headline[1]}
              </motion.span>
            </AnimatePresence>
          </h1>
        </div>

        {/* desc */}
        <AnimatePresence mode="wait">
          <motion.p key={`desc-${slide}`}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="h-desc text-sm md:text-base font-light max-w-xs mb-10 leading-relaxed"
            style={{ color: "rgba(242,232,217,0.5)", opacity: 0 }}>
            {current.sub}
          </motion.p>
        </AnimatePresence>

        {/* CTAs */}
        <div className="h-cta flex items-center gap-5" style={{ opacity: 0 }}>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: `0 0 50px ${current.accent}40` }}
            whileTap={{ scale: 0.96 }}
            onClick={onOrderClick}
            className="relative group px-9 py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] overflow-hidden"
            style={{ background: "linear-gradient(135deg, #D4A843, #8B6914)", color: "#0a0800" }}>
            <motion.span className="absolute inset-0 -skew-x-12"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }}
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
            />
            <span className="relative">Order Now</span>
          </motion.button>

          <motion.a href="#collection"
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] transition"
            style={{ color: "rgba(242,232,217,0.4)" }}>
            Explore Menu
            <motion.svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </motion.svg>
          </motion.a>
        </div>

        {/* stats */}
        <div className="flex items-center gap-10 mt-14 pt-8"
          style={{ borderTop: "1px solid rgba(242,232,217,0.07)" }}>
          {[["500+","Customers"],["50+","Items"],["4.9★","Rating"],["6+","Years"]].map(([n,l]) => (
            <div key={l} className="h-stat" style={{ opacity: 0 }}>
              <p className="text-xl font-bold" style={{
                background: "linear-gradient(135deg, #D4A843, #F0CC6E)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>{n}</p>
              <p className="text-[9px] uppercase tracking-widest mt-1" style={{ color: "rgba(242,232,217,0.28)" }}>{l}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Slide progress bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex">
        {SLIDES.map((_, i) => (
          <motion.div key={i}
            className="h-0.5 flex-1 cursor-pointer"
            style={{ background: i === slide ? current.accent : "rgba(242,232,217,0.1)" }}
            onClick={() => { setPrev(slide); setSlide(i); }}
          >
            {i === slide && (
              <motion.div className="h-full origin-left"
                style={{ background: current.accent }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: "linear" }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Slide counter ── */}
      <div className="absolute bottom-6 right-8 z-20 hidden md:flex items-center gap-3">
        <span className="text-[11px] font-bold" style={{ color: current.accent }}>
          {String(slide + 1).padStart(2, "0")}
        </span>
        <div className="w-8 h-px" style={{ background: "rgba(242,232,217,0.2)" }}/>
        <span className="text-[11px]" style={{ color: "rgba(242,232,217,0.3)" }}>
          {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2">
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
          className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5"
          style={{ borderColor: "rgba(242,232,217,0.15)" }}>
          <div className="w-0.5 h-2 rounded-full" style={{ background: current.accent }}/>
        </motion.div>
      </motion.div>

    </section>
  );
}
