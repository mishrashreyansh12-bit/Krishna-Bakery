import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useLocation, TRANSLATIONS } from "../context/LocationContext";

const MILESTONES = [
  { year: "2019", title: "Where It All Began",     desc: "One oven, two bakers, one dream — to bake something honest.", icon: "🔥" },
  { year: "2020", title: "Survived & Thrived",      desc: "Through the toughest year, home deliveries kept us alive.", icon: "💪" },
  { year: "2021", title: "First 1000 Orders",       desc: "Classic English Cake became the city's favourite.", icon: "🎉" },
  { year: "2022", title: "Expanding the Family",    desc: "5 new locations. Bigger kitchen, same original recipes.", icon: "📍" },
  { year: "2023", title: "Going Beyond the City",   desc: "3 new cities. Velvet Cheesecake won a regional award.", icon: "🏆" },
  { year: "2024–25", title: "20 Locations & Counting", desc: "Every item still baked fresh, every day — just like day one.", icon: "🌟" },
];

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

export default function OurStory() {
  const { lang } = useLocation();
  const t = TRANSLATIONS[lang] || TRANSLATIONS["en"];

  const VALUES = [
    { icon: "🌾", title: t.storyFreshTitle,      desc: t.storyFreshDesc      },
    { icon: "🤍", title: t.storyNoShortcuts,     desc: t.storyNoShortcutsDesc },
    { icon: "👨‍🍳", title: t.storyBakers,         desc: t.storyBakersDesc     },
  ];

  const bannerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: bannerRef, offset: ["start end", "end start"] });
  const bannerY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section id="our-story" style={{ background: "var(--bg)" }}>

      {/* ── Cinematic banner ── */}
      <div ref={bannerRef} className="relative h-[50vh] sm:h-[70vh] overflow-hidden flex items-center justify-center">
        <motion.div className="absolute inset-0" style={{ y: bannerY }}>
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=90&w=2400"
            alt="Our Story"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(8,6,4,0.5) 0%, rgba(8,6,4,0.3) 50%, rgba(8,6,4,0.95) 100%)"
          }}/>
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <FadeIn>
            <p className="text-[10px] uppercase tracking-[0.5em] mb-5"
              style={{ color: "rgba(212,168,67,0.6)" }}>{t.storyEst}</p>
            <h2 className="text-4xl sm:text-5xl md:text-8xl font-light text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.02em" }}>
              {t.storyTitle.split(" ")[0]} <em className="font-bold italic" style={{
                background: "linear-gradient(135deg, #C9973A, #F0CC6E)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>{t.storyTitle.split(" ").slice(1).join(" ")}</em>
            </h2>
            <p className="text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed"
              style={{ color: "rgba(255,255,255,0.45)" }}>
              {t.storySubtitle}
            </p>
          </FadeIn>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="py-16 px-6" style={{ background: "rgba(212,168,67,0.06)", borderTop: "1px solid rgba(212,168,67,0.1)", borderBottom: "1px solid rgba(212,168,67,0.1)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[["6+", t.storyYears],["20+", t.storyOutlets],["10", t.storyCities],["50K+", t.storyCustomers]].map(([v,l], i) => (
            <FadeIn key={l} delay={i * 0.1} className="text-center">
              <p className="text-4xl font-bold mb-1" style={{
                background: "linear-gradient(135deg, #D4A843, #F5D78E)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>{v}</p>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>{l}</p>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="py-12 md:py-28 px-4 sm:px-6 max-w-4xl mx-auto">
        <FadeIn className="text-center mb-20">
          <p className="text-[10px] uppercase tracking-[0.5em] mb-4" style={{ color: "rgba(212,168,67,0.6)" }}>{t.storyJourney}</p>
          <h3 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t.storyPassion.replace(t.storyPassionItalic, "").trim()}, <em className="font-bold italic" style={{
              background: "linear-gradient(135deg, #C9973A, #F0CC6E)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>{t.storyPassionItalic}</em>
          </h3>
        </FadeIn>

        <div className="relative">
          {/* center line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(212,168,67,0.3), transparent)" }} />

          <div className="space-y-14">
            {MILESTONES.map((m, i) => (
              <FadeIn key={m.year} delay={i * 0.08}>
                <div className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  {/* dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center text-base z-10 shrink-0"
                    style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.3)" }}>
                    {m.icon}
                  </div>

                  {/* card */}
                  <div className={`ml-14 md:ml-0 md:w-[44%] ${i % 2 === 0 ? "md:mr-auto md:pr-14" : "md:ml-auto md:pl-14"}`}>
                    <div className="rounded-2xl p-6 transition-all duration-300 hover:border-amber-400/20"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block"
                        style={{ background: "rgba(212,168,67,0.1)", color: "#D4A843", border: "1px solid rgba(212,168,67,0.2)" }}>
                        {m.year}
                      </span>
                      <h4 className="text-base font-semibold text-white mt-3 mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}>{m.title}</h4>
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{m.desc}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ── Values ── */}
      <div className="py-20 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUES.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -4, borderColor: "rgba(212,168,67,0.2)" }}
                className="rounded-2xl p-8 text-center transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="text-3xl mb-5">{v.icon}</div>
                <h4 className="text-base font-semibold text-white mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}>{v.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{v.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── Closing quote ── */}
      <div className="py-28 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,168,67,0.05) 0%, transparent 70%)" }} />
        <FadeIn className="relative z-10 max-w-3xl mx-auto">
          <div className="text-6xl mb-8 opacity-20" style={{ color: "#D4A843", fontFamily: "Georgia, serif" }}>"</div>
          <blockquote className="text-2xl md:text-4xl font-light text-white leading-relaxed mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            {t.storyQuote}
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, rgba(212,168,67,0.5))" }} />
            <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(212,168,67,0.5)" }}>{t.storySince}</p>
            <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, rgba(212,168,67,0.5))" }} />
          </div>
        </FadeIn>
      </div>

    </section>
  );
}
