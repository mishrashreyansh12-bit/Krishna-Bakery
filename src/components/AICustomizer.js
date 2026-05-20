import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

const SUGGESTIONS = [
  { mood: "summer",   emoji: "🍋", name: "Lemon Lavender Chiffon",      desc: "Light sponge with fresh lemon zest and dried lavender, finished with a honey glaze." },
  { mood: "winter",   emoji: "🍫", name: "Dark Chocolate Spice Cake",   desc: "Rich cocoa layers with cinnamon, cardamom, and a hint of chili. Dusted with cocoa." },
  { mood: "cozy",     emoji: "🍎", name: "Brown Butter Apple Cake",     desc: "Caramelized apple slices in nutty brown butter batter. Crunchy oat crumble on top." },
  { mood: "romantic", emoji: "🌹", name: "Rose & Raspberry Cheesecake", desc: "Velvety cream cheese with rose-infused raspberry coulis. Edible rose petals." },
  { mood: "tropical", emoji: "🥭", name: "Mango Coconut Macaron Tower", desc: "Crisp shells filled with mango curd and coconut buttercream. Pure tropics." },
  { mood: "birthday", emoji: "🎂", name: "Confetti Celebration Cake",   desc: "Vanilla sponge with rainbow sprinkles, whipped cream, and gold leaf finish." },
  { mood: "coffee",   emoji: "☕", name: "Espresso Tiramisu Cake",      desc: "Mascarpone layers soaked in espresso, dusted with premium cocoa powder." },
];

const MOODS = ["Summer", "Winter", "Cozy", "Romantic", "Tropical", "Birthday", "Coffee"];

export default function AICustomizer() {
  const [mood,    setMood]    = useState("");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const btnRef = useRef(null);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  function generate(val) {
    const m = (val || mood).trim();
    if (!m) return;
    setLoading(true);
    setResult(null);

    // button pulse
    gsap.to(btnRef.current, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });

    setTimeout(() => {
      const lower = m.toLowerCase();
      const match = SUGGESTIONS.find(s => lower.includes(s.mood));
      setResult(match || {
        emoji: "✨",
        name: `Custom Bake for "${m}"`,
        desc: "A unique blend of seasonal ingredients curated to match your vibe. Visit us to taste the creation!",
      });
      setLoading(false);
    }, 1600);
  }

  return (
    <section id="ai-customizer" ref={ref}
      style={{ background: "linear-gradient(180deg, #0a0804 0%, #0d0b06 100%)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>

      <div className="max-w-screen-xl mx-auto px-8 md:px-16 lg:px-24 py-32">

        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] mb-5"
            style={{ color: "rgba(212,168,67,0.55)" }}>AI Powered</p>
          <h2 className="text-4xl md:text-6xl font-light text-white mb-5"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.02em" }}>
            Create Your
            <br />
            <em className="font-bold italic" style={{
              background: "linear-gradient(135deg, #C9973A, #F0CC6E)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>Dream Dessert</em>
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
            Describe your mood and our AI crafts the perfect flavour profile for you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start max-w-4xl mx-auto">

          {/* left — input */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* mood chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {MOODS.map(m => (
                <motion.button key={m}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setMood(m); generate(m); }}
                  className="text-[10px] uppercase tracking-widest px-4 py-2 rounded-full transition-all"
                  style={{
                    background: mood === m ? "rgba(212,168,67,0.15)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${mood === m ? "rgba(212,168,67,0.4)" : "rgba(255,255,255,0.08)"}`,
                    color: mood === m ? "#D4A843" : "rgba(255,255,255,0.4)",
                  }}>
                  {m}
                </motion.button>
              ))}
            </div>

            {/* input */}
            <div className="relative mb-4">
              <input
                type="text"
                value={mood}
                onChange={e => setMood(e.target.value)}
                onKeyDown={e => e.key === "Enter" && generate()}
                placeholder="e.g. Summer Sunset, Cozy Winter..."
                className="w-full rounded-2xl px-5 py-4 text-sm text-white placeholder-white/20 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(212,168,67,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            <motion.button
              ref={btnRef}
              whileHover={{ scale: 1.03, boxShadow: "0 0 50px rgba(212,168,67,0.2)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => generate()}
              disabled={loading || !mood.trim()}
              className="w-full py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.25em] transition-all disabled:opacity-40 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #C9973A, #8B6914)", color: "#0a0800" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"/>
                  Crafting your bake...
                </span>
              ) : "Generate Custom Concept →"}
            </motion.button>
          </motion.div>

          {/* right — result */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl p-8 min-h-[220px] flex flex-col justify-center relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {/* ambient glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at top right, rgba(212,168,67,0.05) 0%, transparent 60%)" }}/>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-4 py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 rounded-full border-2 border-t-transparent"
                    style={{ borderColor: "rgba(212,168,67,0.4)", borderTopColor: "transparent" }}
                  />
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Crafting your perfect bake...</p>
                </motion.div>
              ) : result ? (
                <motion.div key="result"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                  <p className="text-[10px] uppercase tracking-[0.4em] mb-4"
                    style={{ color: "rgba(212,168,67,0.55)" }}>AI Suggestion</p>
                  <div className="text-4xl mb-4">{result.emoji}</div>
                  <h3 className="text-lg font-semibold text-white mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}>{result.name}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{result.desc}</p>
                </motion.div>
              ) : (
                <motion.div key="placeholder"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-8">
                  <div className="text-4xl mb-4 opacity-30">🎂</div>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                    Your custom bake profile will appear here
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
